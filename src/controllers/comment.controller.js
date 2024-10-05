import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ videoId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const totalComments = await Comment.countDocuments({ videoId });

    res.status(200).json(
        new ApiResponse(
            true,
            {
                comments,
                totalComments,
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
            },
            "Comments retrieved successfully."
        )
    );
});

// Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Comment content is required.");
    }

    const newComment = await Comment.create({
        videoId,
        content,
        user: req.user._id, // Assuming you have user info in req.user
    });

    res.status(201).json(new ApiResponse(true, newComment, "Comment added successfully."));
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true, runValidators: true }
    );

    if (!updatedComment) {
        throw new ApiError(404, "Comment not found.");
    }

    res.status(200).json(new ApiResponse(true, updatedComment, "Comment updated successfully."));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
        throw new ApiError(404, "Comment not found.");
    }

    res.status(204).json(new ApiResponse(true, null, "Comment deleted successfully."));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
};
