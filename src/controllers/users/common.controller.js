import { getAllActiveBanners } from '../../services/admin/banner.service.js';
import { getAllActiveCategory } from '../../services/admin/category.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isCacheValid,setCache, getCache } from '../../utils/cache.js'; // Import cache utility functions

const CACHE_EXPIRATION = 3600 * 1000; // Cache expiration time in milliseconds (1 hour)

// Fetching all active banners with caching
const getAllBanners = asyncHandler(async (req, res) => {
    // Attempt to get cached banners
    if (isCacheValid('banners')) {
        // Send cached data
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, getCache('banners'), "Banners fetched successfully.")
        );
    }
  
    // If not cached, fetch from the database
    const banners = await getAllActiveBanners();

    // Store fetched data in cache with timestamp
    setCache('banners', banners, CACHE_EXPIRATION);

    // Send response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, banners, "Banners fetched successfully")
    );
});

// Fetching all active categories with caching
const getAllCategory = asyncHandler(async (req, res) => {
    // Attempt to get cached categories

    if (isCacheValid('categories')) {
        // Send cached data
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, getCache('categories'), "Categories fetched successfully.")
        );
    }
    // If not cached, fetch from the database
    const categories = await getAllActiveCategory();

    // Store fetched data in cache with timestamp
    setCache('categories', categories, CACHE_EXPIRATION);

    // Send response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, categories, "Categories fetched successfully")
    );
});

export {
    getAllBanners,
    getAllCategory
};
