import * as CategoryService from '../../services/category.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// Creating a new Category
const createCategory = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;  // Get the path of the uploaded file

    // Check if the image file exists
    if (!avatarLocalPath) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Image file is missing");
    }

    // Pass both the form data (req.body) and the avatarLocalPath to the service
    const newCategory = await CategoryService.createCategory(req.body, avatarLocalPath);

    if (!newCategory) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create Category");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, newCategory, "Category created successfully")
    );
});

// Fetching all active Categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await CategoryService.getAllCategories();
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, categories, "Categories fetched successfully")
    );
});

// Fetching a single Category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await CategoryService.getCategoryById(req.params.id);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, category, "Category fetched successfully")
    );
});

// Updating a Category by ID
const updateCategoryById = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;  // Get the path of the uploaded file

    // Update category with both form data and avatar path if provided
    const updatedCategory = await CategoryService.updateCategoryById(req.params.id, req.body, avatarLocalPath);

    if (!updatedCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedCategory, "Category updated successfully")
    );
});

// Soft deleting a Category by ID
const softDeleteCategoryById = asyncHandler(async (req, res) => {
    const deletedCategory = await CategoryService.softDeleteCategoryById(req.params.id);
    if (!deletedCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, deletedCategory, "Category deleted successfully")
    );
});

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    softDeleteCategoryById
};
