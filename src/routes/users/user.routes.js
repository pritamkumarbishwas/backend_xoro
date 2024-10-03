import { Router } from "express";
import { verifyJWT } from "../../middlewares/users.auth.middleware.js"; // Ensure path is correct
import * as userController from "../../controllers/users/user.controller.js"; // Ensure path is correct
import * as userValidation from '../../validations/users.validation.js';
import validate from "../../middlewares/validate.js";
import { upload } from "../../middlewares/multer.middleware.js"

const router = Router();

// Route for user registration // 
router.route("/login").post(validate(userValidation.userLogin), userController.userLogin);
router.route("/verify_otp").post(validate(userValidation.verifyOtp), userController.otpVerify);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), userController.updateUserAvatar);
router.route("/profile").post(verifyJWT,validate(userValidation.updateProfile), userController.updateProfile);

// You can add more routes below as needed

export default router;
