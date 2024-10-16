import { GiftCard } from '../../models/gift.card.model.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from "http-status";

// Function to create a new GiftCard with an image
const create = async (userId, data) => {

    const { giftCardCategoryId, value } = data;


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
        userId,
    };

    // Create and save the new GiftCard
    const newGiftCard = new GiftCard(giftCardData);

    // Save the GiftCard to the database
    return await newGiftCard.save();
};

// Function to fetch all gift cards
const getAllGiftCards = async (userId) => {
    return await GiftCard.find({ userId: userId }).populate('giftCardCategoryId');
};


// Function to fetch a gift card by ID
const getById = async (id) => {
    const giftCard = await GiftCard.findById(id).populate('giftCardCategoryId');
    if (!giftCard) {
        throw new ApiError(httpStatus.NOT_FOUND, "Gift card not found");
    }
    return giftCard;
};


const redeem = async (id, userId) => {
    // Find the gift card by ID
    const giftCard = await GiftCard.findById(id);

    if (!giftCard) {
        throw new ApiError(httpStatus.NOT_FOUND, "GiftCard not found.");
    }

    // Check if the gift card is already redeemed
    if (giftCard.status === 'Redeemed') {
        throw new ApiError(httpStatus.BAD_REQUEST, "GiftCard is already redeemed.");
    }

    // Check if the gift card is active
    if (giftCard.status !== 'Active') {
        throw new ApiError(httpStatus.BAD_REQUEST, "GiftCard cannot be redeemed as it is not active.");
    }

    // Check if the gift card has expired
    const currentDate = new Date();
    if (currentDate > giftCard.expiryDate) {
        throw new ApiError(httpStatus.BAD_REQUEST, "GiftCard has expired and cannot be redeemed.");
    }

    // Redeem the gift card
    giftCard.status = 'Redeemed';
    giftCard.userId = userId; // Optionally associate it with the user who redeemed it
    await giftCard.save();

    return giftCard;
};

export {
    create,
    getAllGiftCards,
    getById,
    redeem
};
