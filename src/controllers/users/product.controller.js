// src/controllers/admin/product.controller.js
import { getAllActiveProducts } from '../../services/product.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isCacheValid, getCache, setCache } from '../../utils/cache.js'; // Import cache utilities

// Fetching all active products with caching
const getAllProducts = asyncHandler(async (req, res) => {
    // Check if products are cached and not expired
    if (isCacheValid('products')) {
        // Send cached data
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, getCache('products'), "Products fetched successfully.")
        );
    }

    try {
        // If not cached or expired, fetch from database
        const products = await getAllActiveProducts();

        // Store fetched data in cache with timestamp
        setCache('products', products); // Use utility to set cache

        // Send response
        return res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, products, "Products fetched successfully")
        );
    } catch (error) {
        // Handle any errors that occur during the database fetch
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch products from the database.");
    }
});

export {
    getAllProducts
};
