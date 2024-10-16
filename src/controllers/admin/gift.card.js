import * as giftCardService from '../../services/admin/gift.card.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// Creating a new GiftCard
const createGiftCard = asyncHandler(async (req, res) => {
    const adminId = req.admin._id;
    const result = await giftCardService.create(adminId, req.body);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create GiftCard.");
    }

    return res.status(httpStatus.CREATED).json(
        new ApiResponse(httpStatus.CREATED, result, "GiftCard created successfully.")
    );
});

// Fetching all GiftCards
const getAllGiftCards = asyncHandler(async (req, res) => {
    // Fetch gift cards from the service
    const giftCards = await giftCardService.getAllGiftCards();

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, giftCards, "GiftCards fetched successfully.")
    );
});

// Fetching a single GiftCard by ID
const getById = asyncHandler(async (req, res) => {
    const result = await giftCardService.getById(req.params.id);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "GiftCard not found.");
    }
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, result, "GiftCard fetched successfully.")
    );
});

// Updating a GiftCard by ID
const updateById = asyncHandler(async (req, res) => {
    const updated = await giftCardService.updateById(req.params.id, req.body);

    if (!updated) {
        throw new ApiError(httpStatus.NOT_FOUND, "GiftCard not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updated, "GiftCard updated successfully.")
    );
});

const updateExpiryDate = async (req, res) => {
    const { id } = req.params;
    const { expiryDate } = req.body;

    const updated = await giftCardService.updateExpiaryById(id, expiryDate);

    if (!updated) {
        throw new ApiError(httpStatus.NOT_FOUND, "GiftCard not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updated, "GiftCard updated successfully.")
    );

};


// Soft deleting a GiftCard by ID
const softDeleteById = asyncHandler(async (req, res) => {
    const deleted = await giftCardService.softDeleteById(req.params.id);
    if (!deleted) {
        throw new ApiError(httpStatus.NOT_FOUND, "GiftCard not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, deleted, "GiftCard deleted successfully.")
    );
});

export {
    createGiftCard,
    getAllGiftCards,
    getById,
    updateById,
    updateExpiryDate,
    softDeleteById
};
