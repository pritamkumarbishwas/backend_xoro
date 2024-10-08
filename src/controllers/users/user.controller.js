import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as UserService from '../../services/user.service.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// User login - generates OTP
const userLogin = asyncHandler(async (req, res, next) => {
    const { phone } = req.body;

    // Generate OTP and get user info
    const { otp, user } = await UserService.generateOtp(phone);

    // Handle case where OTP generation failed
    if (!otp) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP");
    }
    
    // Send OTP response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, otp, "OTP sent successfully")
    );

});


// OTP verification and login
const otpVerify = asyncHandler(async (req, res, next) => {
    const { phone, otp, fcmToken } = req.body;

    // Verify OTP and log in user
    const response = await UserService.verifyOtpAndLogin({ phone, otp, fcmToken });

    // Send response with user data and tokens
    return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, response, "User logged in successfully"));
});


const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    // Check if avatar file exists
    if (!avatarLocalPath) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Avatar file is missing");
    }

    // Call service to update the user profile image
    const updatedUser = await UserService.updateUserProfileImage(req.user._id, avatarLocalPath);

    // Send success response with updated user data
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedUser, "Avatar image updated successfully")
    );
});

const updateProfile = asyncHandler(async (req, res) => {

    // Call service to update the user profile image
    const updatedUser = await UserService.updateUserProfile(req.user._id, req.body);

    // Send success response with updated user data
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedUser, "Profile updated successfully")
    );
});


// Google login handler
const userGoogleLogin = asyncHandler(async (req, res, next) => {
    const { email, firstName, lastName, fcmToken } = req.body;

    try {
        const response = await UserService.googleLogin({ email, firstName, lastName, fcmToken });
        return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, response.data, response.message));
    } catch (error) {
        next(error);
    }
});


// Facebook login handler
const userFacebookLogin = asyncHandler(async (req, res, next) => {
    const { facebookId, firstName, lastName, fcmToken } = req.body;

    try {
        const response = await UserService.facebookLogin({ facebookId, firstName, lastName, fcmToken });
        return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, response.data, response.message));
    } catch (error) {
        next(error);
    }
});


// Exporting the functions
export {
    userLogin,
    otpVerify,
    updateUserAvatar,
    updateProfile,
    userGoogleLogin,
    userFacebookLogin
};
