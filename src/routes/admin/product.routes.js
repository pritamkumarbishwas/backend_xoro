import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import * as bannerValidation from '../../validations/banner.validation.js';
import * as productController from "../../controllers/admin/product.controller.js"; // Ensure the path is correct
import validate from "../../middlewares/validate.js";
import { verifyJWT } from "../../middlewares/users.auth.middleware.js"; // Ensure the path is correct

const router = Router();

// Route to fetch all products
router.get("/product", verifyJWT, productController.getAllBanners);

// Route to fetch a single products by ID
router.get("/product/:id", verifyJWT, validate(bannerValidation.getBannerById), productController.getBannerById);

// Route to create a new banner (POST)
router.post("/product", verifyJWT, upload.single("image"), productController.createBanner);

// Route to update an existing banner (PUT)
router.put("/product/:id", verifyJWT, upload.single("image"), productController.updateBannerById);

// Route to soft delete a banner by ID (POST or DELETE)
router.delete("/product/:id", verifyJWT, validate(bannerValidation.softDeleteBannerById), productController.softDeleteBannerById);

export default router;
