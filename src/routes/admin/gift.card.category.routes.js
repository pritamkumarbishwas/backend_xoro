import { Router } from "express";
import * as giftCardCategoryController from "../../controllers/admin/gift.card.category.js"; // Ensure the path is accurate
import { upload } from "../../middlewares/multer.middleware.js"; // Multer middleware for file uploads
import * as giftCardCategoryValidation from '../../validations/gift.card.category.validation.js'; // Import validation rules
import validate from "../../middlewares/validate.js"; // Validation middleware
import { verifyJWT } from "../../middlewares/admin.auth.middleware.js"; // JWT verification middleware

const router = Router();

// Route to fetch all categories
router.get(
    "/gift_card_category",
    verifyJWT,
    giftCardCategoryController.getAllCategories
);

// Route to fetch a single category by ID
router.get(
    "/gift_card_category/:id",
    verifyJWT,
    validate(giftCardCategoryValidation.getCategoryById),
    giftCardCategoryController.getCategoryById
);


// Route to create a new category (POST)
router.post(
    "/gift_card_category",
    verifyJWT,
    upload.single("image"), // Middleware to handle image upload
    validate(giftCardCategoryValidation.createGiftCardCategory), // Validate the request body
    giftCardCategoryController.createGiftCardCategory
);

// Route to update an existing category (PUT) 
router.put(
    "/gift_card_category/:id",
    verifyJWT,
    upload.single("image"), // Middleware to handle updated image upload
    validate(giftCardCategoryValidation.updateCategoryById), // Validate the update request
    giftCardCategoryController.updateCategoryById
);

// Route to soft delete a category by ID (DELETE)
router.delete(
    "/gift_card_category/:id",
    verifyJWT,
    validate(giftCardCategoryValidation.softDeleteCategoryById), // Validate the delete request
    giftCardCategoryController.softDeleteCategoryById
);

export default router;
