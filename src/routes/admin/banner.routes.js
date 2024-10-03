import { Router } from "express";
import { verifyJWT } from "../../middlewares/users.auth.middleware.js"; // Ensure the path is correct
import * as bannerController from "../../controllers/admin/banner.controller.js"; // Ensure the path is correct
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

// Route to fetch all banners
router.get("/banner", verifyJWT, bannerController.getAllBanners);

// Route to fetch a single banner by ID
router.get("/banner/:id", verifyJWT, bannerController.getBannerById);

// Route to create a new banner (POST)
router.post("/banner", verifyJWT, upload.single("avatar"), bannerController.createBanner);

// Route to update an existing banner (PUT)
router.put("/banner/:id", verifyJWT, upload.single("avatar"), bannerController.updateBannerById);

// Route to soft delete a banner by ID (POST or DELETE)
router.delete("/banner/:id", verifyJWT, bannerController.softDeleteBannerById);

export default router;
