import { getAllActiveBanners } from '../../services/admin/banner.service.js';
import { getAllActiveCategory } from '../../services/admin/category.service.js';
import { getUsersTermCondition } from '../../services/admin/term.condition.service.js';
import { getUsersPrivacyPolicy } from '../../services/admin/privacy.policy.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isCacheValid, setCache, getCache } from '../../utils/cache.js';

const CACHE_EXPIRATION = 3600 * 1000; // Cache expiration time in milliseconds (1 hour)

// Fetch all active banners with caching
const getAllBanners = asyncHandler(async (req, res) => {
    // Attempt to get cached banners
    if (isCacheValid('banners')) {
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, getCache('banners'), "Banners fetched successfully.")
        );
    }

    // If not cached, fetch from the database
    const banners = await getAllActiveBanners();

    // Store fetched data in cache
    setCache('banners', banners, CACHE_EXPIRATION);

    // Send response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, banners, "Banners fetched successfully.")
    );
});

// Fetch all active categories with caching
const getAllCategory = asyncHandler(async (req, res) => {
    // Attempt to get cached categories
    if (isCacheValid('categories')) {
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, getCache('categories'), "Categories fetched successfully.")
        );
    }

    // If not cached, fetch from the database
    const categories = await getAllActiveCategory();

    // Store fetched data in cache
    setCache('categories', categories, CACHE_EXPIRATION);

    // Send response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, categories, "Categories fetched successfully.")
    );
});

// Fetch all active terms and conditions with caching
const getTermCondition = asyncHandler(async (req, res) => {
    // Attempt to get cached term conditions
    if (isCacheValid('termCondition')) {
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, getCache('termCondition'), "Term and conditions fetched successfully.")
        );
    }

    // If not cached, fetch from the database
    const result = await getUsersTermCondition();

    // Store fetched data in cache
    setCache('termCondition', result, CACHE_EXPIRATION);

    // Send response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, result, "Term and conditions fetched successfully.")
    );
});

// Fetch all active privacy policy with caching
const getPrivacyPolicy = asyncHandler(async (req, res) => {
    // Attempt to get cached privacy policy
    if (isCacheValid('privacyPolicy')) {
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, getCache('privacyPolicy'), "Privacy policy fetched successfully.")
        );
    }

    // If not cached, fetch from the database
    const result = await getUsersPrivacyPolicy();

    // Store fetched data in cache
    setCache('privacyPolicy', result, CACHE_EXPIRATION);

    // Send response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, result, "Privacy policy fetched successfully.")
    );
});

export {
    getAllBanners,
    getAllCategory,
    getTermCondition,
    getPrivacyPolicy
};
