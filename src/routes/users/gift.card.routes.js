import { Router } from "express";
import * as giftCardController from "../../controllers/users/gift.card.js";
import * as giftCardValidation from '../../validations/gift.card.validation.js';
import validate from "../../middlewares/validate.js";
import { verifyJWT } from "../../middlewares/users.auth.middleware.js"; // Ensure path is correct

const router = Router();

// Route to fetch all gift cards
router.get("/gift_cards", verifyJWT, giftCardController.getAllGiftCards);

// Route to fetch a single gift card by ID
router.get("/gift_cards/:id", verifyJWT, validate(giftCardValidation.getById), giftCardController.getById);

// Route to create a new gift card (POST)
router.post("/gift_cards", verifyJWT, validate(giftCardValidation.createUserGiftCard), giftCardController.createGiftCard);

// New route to redeem a gift card
router.post("/gift_cards/redeem", verifyJWT, validate(giftCardValidation.redem), giftCardController.redeemGiftCard);

export default router;
