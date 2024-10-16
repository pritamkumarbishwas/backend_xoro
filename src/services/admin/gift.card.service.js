import { GiftCard } from '../../models/gift.card.model.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from "http-status";

// Function to create a new GiftCard with an image
const create = async (adminId, data) => {

    const { giftCardCategoryId, value, status } = data;


    if (!value) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Value is required.");
    }

    if (!giftCardCategoryId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Category is required.");
    }

    // Prepare GiftCard data according to the schema
    const giftCardData = {
        giftCardCategoryId,
        value,
        adminId,
        status,
    };

    // Create and save the new GiftCard
    const newGiftCard = new GiftCard(giftCardData);

    // Save the GiftCard to the database
    return await newGiftCard.save();
};

// Function to fetch all gift cards
const getAllGiftCards = async () => {
    return await GiftCard.find();
};

// Function to fetch all Active gift cards
const getAllActiveGiftCards = async () => {
    return await GiftCard.find({ status: "Active" });
};

// Function to fetch a gift card by ID
const getById = async (id) => {
    const giftCard = await GiftCard.findById(id);
    if (!giftCard) {
        throw new ApiError(httpStatus.NOT_FOUND, "Gift card not found");
    }
    return giftCard;
};

// Function to update a gift card by ID
const updateById = async (id, data) => {

    const { giftCardCategoryId, value, status } = data;

    // Initialize updateData with available fields
    const updateData = {};

    // Add provided fields to updateData

    if (value) updateData.value = value;
    if (giftCardCategoryId) updateData.giftCardCategoryId = giftCardCategoryId;
    if (status) updateData.status = status;

    const updatedGiftCard = await GiftCard.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedGiftCard) {
        throw new ApiError(httpStatus.NOT_FOUND, "Gift card not found");
    }

    return updatedGiftCard;
};

// Function to update a gift card by ID
const updateExpiaryById = async (id, expiryDate) => {
    const updateData = { expiryDate };

    const updatedGiftCard = await GiftCard.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }); // Update the gift card

    if (!updatedGiftCard) {
        throw new ApiError(httpStatus.NOT_FOUND, "Gift card not found"); // Throw an error if not found
    }

    return updatedGiftCard; // Return the updated gift card
};

// Function to soft delete a gift card by ID
const softDeleteById = async (id) => {
    const deletedGiftCard = await GiftCard.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedGiftCard) {
        throw new ApiError(httpStatus.NOT_FOUND, "Gift card not found");
    }
    return deletedGiftCard;
};

export {
    create,
    getAllGiftCards,
    getAllActiveGiftCards,
    getById,
    updateById,
    updateExpiaryById,
    softDeleteById
};
