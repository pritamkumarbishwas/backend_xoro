import { Voucher } from '../../models/voucher.model.js';
import { UserVoucher } from '../../models/user.voucher.model.js'; // Updated model name for voucher usage tracking
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from "http-status";


// Function to redeem a voucher
const redeemVoucher = async (userId, voucherCode) => {
    // Find the voucher by code
    const voucher = await Voucher.findOne({ code: voucherCode });

    if (!voucher) {
        throw new ApiError(httpStatus.NOT_FOUND, "Voucher not found.");
    }

    if (voucher.status !== 'Active') {
        throw new ApiError(httpStatus.BAD_REQUEST, "Voucher is not active.");
    }

    // Check if the user has already used the voucher
    const userVoucher = await UserVoucher.findOne({ userId, voucherId: voucher._id });

    if (userVoucher && userVoucher.timesUsed >= voucher.usagePerUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You have already used this voucher the maximum number of times.");
    }

    // Update the user's voucher usage
    if (userVoucher) {
        userVoucher.timesUsed += 1;
        userVoucher.lastUsedDate = new Date();
        await userVoucher.save();
    } else {
        // Create a new user voucher record
        await UserVoucher.create({ userId, voucherId: voucher._id, timesUsed: 1, lastUsedDate: new Date() });
    }

    return voucher.discountValue; // Return the discount value for response
};

export { redeemVoucher };
