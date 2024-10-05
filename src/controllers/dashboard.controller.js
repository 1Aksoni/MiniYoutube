import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get channel statistics
const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channelId });

    // Total videos
    const totalVideos = await Video.countDocuments({ channelId });

    // Total views
    const totalViews = await Video.aggregate([
        { $match: { channelId: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    // Total likes
    const totalLikes = await Like.countDocuments({ videoId: { $in: await Video.find({ channelId }).distinct('_id') } });

    const stats = {
        totalSubscribers,
        totalVideos,
        totalViews: totalViews[0]?.totalViews || 0, // Default to 0 if no videos
        totalLikes,
    };

    res.status(200).json(new ApiResponse(true, stats, "Channel statistics retrieved successfully."));
});

// Get all videos uploaded by the channel
const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const videos = await Video.find({ channelId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by most recent

    const totalVideos = await Video.countDocuments({ channelId });

    res.status(200).json(
        new ApiResponse(
            true,
            {
                videos,
                totalVideos,
                currentPage: page,
                totalPages: Math.ceil(totalVideos / limit),
            },
            "Videos retrieved successfully."
        )
    );
});

export {
    getChannelStats,
    getChannelVideos,
};
