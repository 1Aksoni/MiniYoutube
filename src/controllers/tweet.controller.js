import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a Tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content cannot be empty.");
    }

    const newTweet = new Tweet({
        content,
        user: userId,
        createdAt: new Date(),
    });

    await newTweet.save();

    res.status(201).json(new ApiResponse(true, newTweet, "Tweet created successfully."));
});

// Get User Tweets
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const tweets = await Tweet.find({ user: userId }).sort({ createdAt: -1 }).populate("user", "name"); // Assuming user model has 'name' field

    res.status(200).json(new ApiResponse(true, tweets, "User tweets retrieved successfully."));
});

// Update a Tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content cannot be empty.");
    }

    const tweet = await Tweet.findByIdAndUpdate(tweetId, { content }, { new: true });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    res.status(200).json(new ApiResponse(true, tweet, "Tweet updated successfully."));
});

// Delete a Tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    res.status(200).json(new ApiResponse(true, null, "Tweet deleted successfully."));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
};
