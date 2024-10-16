import { Router } from "express";
import * as giftCardController from "../../controllers/admin/gift.card.js";
import * as giftCardValidation from '../../validations/gift.card.validation.js';
import validate from "../../middlewares/validate.js";
import { verifyJWT } from "../../middlewares/admin.auth.middleware.js";

const router = Router();

// Route to fetch all gift cards
router.get("/gift_cards", verifyJWT, giftCardController.getAllGiftCards);

// Route to fetch a single gift card by ID
router.get("/gift_cards/:id", verifyJWT, validate(giftCardValidation.getById), giftCardController.getById);

// Route to create a new gift card (POST)
router.post("/gift_cards", verifyJWT, validate(giftCardValidation.createGiftCard), giftCardController.createGiftCard);

// Route to update an existing gift card (PUT)
router.put("/gift_cards/:id", verifyJWT, validate(giftCardValidation.updateById), giftCardController.updateById);

// Route to update the expiry date of a gift card (PATCH)
router.patch("/gift_cards/:id/expiry", verifyJWT, validate(giftCardValidation.updateExpiryDate), giftCardController.updateExpiryDate);

// Route to soft delete a gift card by ID (DELETE)
router.delete("/gift_cards/:id", verifyJWT, validate(giftCardValidation.softDeleteById), giftCardController.softDeleteById);

export default router;
