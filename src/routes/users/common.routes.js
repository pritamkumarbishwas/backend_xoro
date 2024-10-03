import { Router } from "express";
import { verifyJWT } from "../../middlewares/users.auth.middleware.js"; // Ensure path is correct
import * as commonController from "../../controllers/users/common.controller.js"; // Ensure path is correct
import * as userValidation from '../../validations/users.validation.js';
import validate from "../../middlewares/validate.js";
import { upload } from "../../middlewares/multer.middleware.js"

const router = Router();

// Route for user registration // 
router.route("/banner").get(verifyJWT, commonController.getAllBanners);

// You can add more routes below as needed

export default router;
