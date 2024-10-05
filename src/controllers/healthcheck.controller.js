import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Health check endpoint
const healthcheck = asyncHandler(async (req, res) => {
    // Return a health check response
    res.status(200).json(new ApiResponse(true, null, "Service is up and running."));
});

export {
    healthcheck
};
