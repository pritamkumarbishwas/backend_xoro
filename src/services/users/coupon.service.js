import { Coupon } from '../../models/coupon.model.js';
import { UserCoupon } from '../../models/user.coupon.model.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from "http-status";


// Function to redeem a coupon 
const redeemCoupon = async (userId, couponCode) => {
    // Find the coupon by code
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
        throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found.");
    }

    if (coupon.status !== 'Active') {
        throw new ApiError(httpStatus.BAD_REQUEST, "Coupon is not active.");
    }

    // Check if the user has already used the coupon
    const userCoupon = await UserCoupon.findOne({ userId, couponId: coupon._id });

    if (userCoupon && userCoupon.timesUsed >= coupon.usagePerUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You have already used this coupon the maximum number of times.");
    }

    // Update the user's coupon usage
    if (userCoupon) {

        userCoupon.timesUsed += 1;
        userCoupon.lastUsedDate = new Date();
        await userCoupon.save();

    } else {
        // Create a new user coupon record
        await UserCoupon.create({ userId, couponId: coupon._id, timesUsed: 1, lastUsedDate: new Date() });
    }

    return coupon.discountValue; // Return the discount value for response
};


export { redeemCoupon };