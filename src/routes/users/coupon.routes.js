import { Router } from "express";
import * as couponController from "../../controllers/users/coupon.controller.js"; // Updated from giftCardController
import * as couponValidation from '../../validations/coupon.validation.js'; // Updated from giftCardValidation
import validate from "../../middlewares/validate.js";
import { verifyJWT } from "../../middlewares/users.auth.middleware.js";

const router = Router();

// Route to fetch all Coupons
router.post("/coupon/redeem", verifyJWT, validate(couponValidation.redeem), couponController.redeemCoupon);

export default router;
