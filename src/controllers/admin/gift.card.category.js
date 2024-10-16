import * as giftCardCategoryService from '../../services/admin/gift.card.category.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// Creating a new Category
const createGiftCardCategory = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path; // Get the path of the uploaded file
    if (!imageLocalPath) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Image file is required.");
    }

    const newCategory = await giftCardCategoryService.createCategory(req.body, imageLocalPath);

    if (!newCategory) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create category.");
    }

    return res.status(httpStatus.CREATED).json(
        new ApiResponse(httpStatus.CREATED, newCategory, "Category created successfully.")
    );
});

// Fetching all Categories
const getAllCategories = asyncHandler(async (req, res) => {
    // Fetch categories from the service
    const categories = await giftCardCategoryService.getAllCategories();

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, categories, "Categories fetched successfully.")
    );
});

// Fetching a single Category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await giftCardCategoryService.getCategoryById(req.params.id);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found.");
    }
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, category, "Category fetched successfully.")
    );
});

// Updating a Category by ID
const updateCategoryById = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path; // Get the path of the uploaded file

    const updatedCategory = await giftCardCategoryService.updateCategoryById(req.params.id, req.body, imageLocalPath);

    if (!updatedCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedCategory, "Category updated successfully.")
    );
});

// Soft deleting a Category by ID
const softDeleteCategoryById = asyncHandler(async (req, res) => {
    const deletedCategory = await giftCardCategoryService.softDeleteCategoryById(req.params.id);
    if (!deletedCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, deletedCategory, "Category deleted successfully.")
    );
});

export {
    createGiftCardCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    softDeleteCategoryById
};
