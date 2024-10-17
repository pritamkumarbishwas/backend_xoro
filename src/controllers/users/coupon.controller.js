import * as CouponsService from '../../services/users/coupon.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from "http-status";
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// Controller to redeem a coupon
const redeemCoupon = asyncHandler(async (req, res) => {
    const { couponCode } = req.body; // Assume the coupon code is sent in the request body
    const userId = req.user._id; // Assuming user ID is stored in the request object

    // Call the service to redeem the coupon
    const discountValue = await CouponsService.redeemCoupon(userId, couponCode);

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, { discountValue }, "Coupon applied successfully.")
    );
});

export {
    redeemCoupon
};
