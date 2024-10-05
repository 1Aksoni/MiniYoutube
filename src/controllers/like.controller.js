import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js"; // Assuming you have a Video model
import { Comment } from "../models/comment.model.js"; // Assuming you have a Comment model
import { Tweet } from "../models/tweet.model.js"; // Assuming you have a Tweet model

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    // Check if videoId is valid
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({ videoId, userId });

    if (existingLike) {
        // If it exists, remove the like
        await existingLike.remove();
        return res.status(200).json(new ApiResponse(true, null, "Like removed."));
    } else {
        // If it doesn't exist, create a new like
        const newLike = new Like({ videoId, userId });
        await newLike.save();
        return res.status(201).json(new ApiResponse(true, null, "Video liked."));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    // Check if commentId is valid
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID.");
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({ commentId, userId });

    if (existingLike) {
        // If it exists, remove the like
        await existingLike.remove();
        return res.status(200).json(new ApiResponse(true, null, "Comment like removed."));
    } else {
        // If it doesn't exist, create a new like
        const newLike = new Like({ commentId, userId });
        await newLike.save();
        return res.status(201).json(new ApiResponse(true, null, "Comment liked."));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    // Check if tweetId is valid
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({ tweetId, userId });

    if (existingLike) {
        // If it exists, remove the like
        await existingLike.remove();
        return res.status(200).json(new ApiResponse(true, null, "Tweet like removed."));
    } else {
        // If it doesn't exist, create a new like
        const newLike = new Like({ tweetId, userId });
        await newLike.save();
        return res.status(201).json(new ApiResponse(true, null, "Tweet liked."));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in req.user

    // Get all liked videos for the user
    const likedVideos = await Like.find({ userId }).populate('videoId'); // Populate with video details

    res.status(200).json(new ApiResponse(true, likedVideos, "Liked videos retrieved successfully."));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
