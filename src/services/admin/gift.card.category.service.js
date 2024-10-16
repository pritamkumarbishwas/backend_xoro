import { GiftCardCategory } from '../../models/gift.card.category.model.js';
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from "http-status";

// Function to create a new category with an image
const createCategory = async (data, imageLocalPath) => {
    const { name, description, status } = data;

    // Validate required fields
    if (!name) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Name is required.");
    }
    if (!status) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Status is required.");
    }

    // Upload the image to Cloudinary using the local file path
    const image = await uploadOnCloudinary(imageLocalPath);

    // Check if the image upload was successful
    if (!image || !image.url) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error while uploading image.");
    }

    // Prepare category data according to the schema
    const categoryData = {
        name,
        description, // Include the description field
        status,
        image: image.url,  // Store the Cloudinary image URL
    };

    // Create and save the new category
    const newCategory = new GiftCardCategory(categoryData);

    // Save the category to the database
    return await newCategory.save();
};

// Function to fetch all categories (including soft-deleted)
const getAllCategories = async () => {
    return await GiftCardCategory.find(); // Fetch all categories including soft-deleted
};

// Function to fetch all active categories
const getAllActiveCategories = async () => {
    return await GiftCardCategory.find({ status: "Active", isDeleted: false }); // Fetch only active categories
};

// Function to fetch a category by ID (excluding soft-deleted)
const getCategoryById = async (id) => {
    const category = await GiftCardCategory.findOne({ _id: id, isDeleted: false });
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
    return category;
};

// Function to update a category by ID
const updateCategoryById = async (id, data, imageLocalPath) => {
    const { name, description, status } = data;

    // Initialize updateData with available fields
    const updateData = {};

    // If new image is provided, upload it
    if (imageLocalPath) {
        const image = await uploadOnCloudinary(imageLocalPath);
        updateData.image = image.url; // Use the new image URL
    }

    // If name, description, or status are provided, add to updateData
    if (name) updateData.name = name; // Use name instead of title
    if (description) updateData.description = description; // Include description
    if (status) updateData.status = status;

    const updatedCategory = await GiftCardCategory.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }

    return updatedCategory;
};

// Function to soft delete a category by ID
const softDeleteCategoryById = async (id) => {
    const deletedCategory = await GiftCardCategory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
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
