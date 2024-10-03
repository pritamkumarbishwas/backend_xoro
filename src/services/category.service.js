import Category from '../models/category.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Assuming you have a utility for Cloudinary
import { ApiError } from "../utils/ApiError.js";
import httpStatus from "http-status";

// Function to create a new category with an image
const createCategory = async (data, avatarLocalPath) => {
    const { status } = data;

    if (!status) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Missing status in request body");
    }

    // Upload the avatar to Cloudinary using the local file path
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // Check if the Cloudinary upload was successful
    if (!avatar.url) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error while uploading avatar");
    }

    // Prepare category data including the Cloudinary URL for the image
    const categoryData = {
        status,
        image: avatar.url,  // Assuming you're storing the avatar URL in the category
    };

    // Create a new category using the processed data
    const newCategory = new Category(categoryData);

    // Save the new category to the database
    return await newCategory.save();
};

// Function to fetch all categories (including soft-deleted or blocked)
const getAllCategories = async () => {
    return await Category.find(); // This will return all categories, both active and deleted
};

// Function to fetch all active categories (excluding soft-deleted or blocked)
const getAllActiveCategories = async () => {
    return await Category.find({ status: "Active", isDeleted: { $ne: true } }); // Filter active and non-deleted categories
};

// Function to fetch a category by ID (excluding soft-deleted)
const getCategoryById = async (id) => {
    const category = await Category.findOne({ _id: id, isDeleted: { $ne: true } }); // Ensure the category is not soft deleted
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
    return category;
};

// Function to update a category by ID
const updateCategoryById = async (id, data, avatarLocalPath) => {
    const updateData = {}; // Initialize an empty object for the fields to be updated

    // Check if avatarLocalPath exists, then upload the new image and update image URL
    if (avatarLocalPath) {
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        updateData.image = avatar.url;  // Add the new avatar URL to the update data
    }

    // Check if status exists in data, then update status
    if (data.status) {
        updateData.status = data.status;
    }

    // Update the category with the new data
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

    // Check if the category exists and was updated
    if (!updatedCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }

    return updatedCategory; // Return the updated document
};

// Function to soft delete a category by ID
const softDeleteCategoryById = async (id) => {
    const deletedCategory = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    
    // Check if the category exists
    if (!deletedCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }

    return deletedCategory;
};

export {
    createCategory,
    getAllCategories,
    getAllActiveCategories,
    getCategoryById,
    updateCategoryById,
    softDeleteCategoryById
};
