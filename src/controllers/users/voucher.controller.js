import * as VoucherService from '../../services/users/voucher.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from "http-status";
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// Controller to redeem a voucher
const redeemVoucher = asyncHandler(async (req, res) => {
    const { voucherCode } = req.body; // Assume the voucher code is sent in the request body
    const userId = req.user._id; // Assuming user ID is stored in the request object

    // Call the service to redeem the voucher
    const discountValue = await VoucherService.redeemVoucher(userId, voucherCode);

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, { discountValue }, "Voucher applied successfully.")
    );
});

export {
    redeemVoucher
};
