import { getAllActiveBanners } from '../../services/banner.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import redisClient from '../../utils/redisClient.js'; // Assuming redis client is set up in utils

const CACHE_KEY = 'allActiveBanners';
const CACHE_EXPIRATION = 3600; // Cache expiration time in seconds (1 hour)

// Fetching all active banners with caching
const getAllBanners = asyncHandler(async (req, res) => {
    // Check if banners are cached
    redisClient.get(CACHE_KEY, async (err, cachedData) => {
        if (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error accessing cache');
        }

        if (cachedData) {
            // Send cached data
            return res.status(httpStatus.OK).json(
                new ApiResponse(httpStatus.OK, JSON.parse(cachedData), "Banners fetched from cache successfully")
            );
        }

        // If not cached, fetch from database
        const banners = await getAllActiveBanners();

        // Store fetched data in cache
        redisClient.setex(CACHE_KEY, CACHE_EXPIRATION, JSON.stringify(banners));

        // Send response
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, banners, "Banners fetched successfully")
        );
    });
});

export {
    getAllBanners
};
