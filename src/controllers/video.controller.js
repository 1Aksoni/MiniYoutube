import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get All Videos
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortType === 'asc' ? 1 : -1 },
    };

    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: 'i' }; // Case insensitive search
    }
    if (userId) {
        filter.user = userId; // Filter by user ID if provided
    }

    const videos = await Video.paginate(filter, options);
    res.status(200).json(new ApiResponse(true, videos, "Videos retrieved successfully."));
});

// Publish a Video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!req.file) {
        throw new ApiError(400, "Video file is required.");
    }

    // Upload the video to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(req.file.path);

    const newVideo = new Video({
        title,
        description,
        videoUrl: uploadedVideo.secure_url, // Cloudinary URL
        user: req.user.id, // Assuming user ID is stored in req.user
        createdAt: new Date(),
    });

    await newVideo.save();
    res.status(201).json(new ApiResponse(true, newVideo, "Video published successfully."));
});

// Get Video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findById(videoId).populate("user", "name"); // Assuming user model has a 'name' field

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    res.status(200).json(new ApiResponse(true, video, "Video retrieved successfully."));
});

// Update Video
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    if (req.file) {
        const uploadedThumbnail = await uploadOnCloudinary(req.file.path); // Assuming thumbnail is also uploaded to Cloudinary
        updateData.thumbnailUrl = uploadedThumbnail.secure_url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, { new: true });

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found.");
    }

    res.status(200).json(new ApiResponse(true, updatedVideo, "Video updated successfully."));
});

// Delete Video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    res.status(200).json(new ApiResponse(true, null, "Video deleted successfully."));
});

// Toggle Publish Status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    video.published = !video.published; // Toggle the publish status
    await video.save();

    res.status(200).json(new ApiResponse(true, video, "Video publish status toggled successfully."));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
