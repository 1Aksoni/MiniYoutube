import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle Subscription for a User
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID.");
    }

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({ subscriber: userId, channel: channelId });

    if (existingSubscription) {
        // Unsubscribe if it exists
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(new ApiResponse(true, null, "Unsubscribed successfully."));
    } else {
        // Subscribe if it does not exist
        const newSubscription = new Subscription({ subscriber: userId, channel: channelId });
        await newSubscription.save();
        return res.status(201).json(new ApiResponse(true, newSubscription, "Subscribed successfully."));
    }
});

// Get Subscriber List for a Channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID.");
    }

    // Fetch the subscribers for the given channel
    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "name email"); // Assuming subscriber model has 'name' and 'email' fields

    res.status(200).json(new ApiResponse(true, subscribers, "Subscriber list retrieved successfully."));
});

// Get Channels Subscribed by a User
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID.");
    }

    // Fetch the channels subscribed by the user
    const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate("channel", "name description"); // Assuming channel model has 'name' and 'description' fields

    res.status(200).json(new ApiResponse(true, subscriptions, "Subscribed channels retrieved successfully."));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
};
