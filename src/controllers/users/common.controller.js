import { getAllActiveBanners, getAllActiveCategory } from '../../services/banner.service.js'; // Assuming both services are in banner.service.js
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// In-memory cache object
const cache = {};
const CACHE_EXPIRATION = 3600 * 1000; // Cache expiration time in milliseconds (1 hour)

// Fetching all active banners with caching
const getAllBanners = asyncHandler(async (req, res) => {
    const currentTime = Date.now();

    // Check if banners are cached and not expired
    if (cache.banners && (currentTime - cache.banners.timestamp < CACHE_EXPIRATION)) {
        // Send cached data
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, cache.banners.data, "Banners fetched from cache successfully")
        );
    }

    // If not cached or expired, fetch from database
    const banners = await getAllActiveBanners();

    // Store fetched data in cache with timestamp
    cache.banners = {
        data: banners,
        timestamp: currentTime
    };

    // Send response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, banners, "Banners fetched successfully")
    );
});

// Fetching all active categories with caching
const getAllCategory = asyncHandler(async (req, res) => {
    const currentTime = Date.now();

    // Check if categories are cached and not expired
    if (cache.categories && (currentTime - cache.categories.timestamp < CACHE_EXPIRATION)) {
        // Send cached data
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, cache.categories.data, "Categories fetched from cache successfully")
        );
    }

    // If not cached or expired, fetch from database
    const categories = await getAllActiveCategory();

    // Store fetched data in cache with timestamp
    cache.categories = {
        data: categories,
        timestamp: currentTime
    };

    // Send response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, categories, "Categories fetched successfully")
    );
});

export {
    getAllBanners,
    getAllCategory
};
