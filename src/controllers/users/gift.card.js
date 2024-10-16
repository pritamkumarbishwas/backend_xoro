import * as giftCardService from '../../services/users/gift.card.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// Creating a new GiftCard
const createGiftCard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const result = await giftCardService.create(userId, req.body);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create GiftCard.");
    }

    return res.status(httpStatus.CREATED).json(
        new ApiResponse(httpStatus.CREATED, result, "GiftCard created successfully.")
    );
});

// Fetching all GiftCards
const getAllGiftCards = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // Fetch gift cards from the service
    const giftCards = await giftCardService.getAllGiftCards(userId);

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

// Fetching all GiftCards
const redeemGiftCard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // Fetch gift cards from the service
    const giftCards = await giftCardService.redeem(req.params.id, userId);

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, giftCards, "GiftCards Redeem successfully.")
    );
});

export {
    createGiftCard,
    getAllGiftCards,
    getById,
    redeemGiftCard
};
