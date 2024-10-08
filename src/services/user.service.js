import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import httpStatus from 'http-status';
import { generateUserAccessAndRefreshTokens } from "../utils/tokenUtils.js";
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// Generate OTP for login
const generateOtp = async (phone) => {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 5 minutes

    // Try to find the user by mobile number
    let user = await User.findOne({ phone });

    // If user does not exist, create a new user
    if (!user) {
        user = new User({ phone, otp: { code: otp, expiresAt } });
    } else {
        // Update existing user with new OTP and expiration time
        user.otp = { code: otp, expiresAt };
    }

    await user.save(); // Save the user with the OTP

    // TODO: Implement SMS sending logic here

    return { otp, user }; // Return the OTP and user object
};


// Verify OTP and log in user
const verifyOtpAndLogin = async ({ phone, otp, fcmToken }) => {
    const user = await User.findOne({ phone });

    // Check if the user exists
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const { code, expiresAt } = user.otp;

    // Check if OTP matches
    if (code !== otp) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid OTP");
    }

    // Check if OTP has expired
    if (Date.now() >= expiresAt) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Expired OTP");
    }

    // Update user with the fcmToken
    await updateUser({ fcmToken }, user._id);

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateUserAccessAndRefreshTokens(user._id);

    // Exclude sensitive information from the response
    const userData = await User.findById(user._id).select("-otp -refreshToken");

    return {
        ...userData.toObject(),
        accessToken,
        refreshToken
    };
};


// Utility function for updating user
const updateUser = async (updateData, userId) => {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};


// Update user profile image
const updateUserProfileImage = async (userId, avatarLocalPath) => {
    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if user has an existing avatar and delete it from Cloudinary (TODO)
    if (user.avatar) {
        await deleteFromCloudinary(user.avatar); // Delete the old avatar if exists
    }

    // Upload the new avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // Check if the Cloudinary upload was successful
    if (!avatar.url) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error while uploading avatar");
    }

    // Update the user's avatar URL in the database
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select("-otp -refreshToken"); // Exclude sensitive fields

    return updatedUser;
};

const updateUserProfile = async (userId, body) => {
    const { firstName, lastName, email, gender } = body;

    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Update the user's profile information in the database
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { firstName, lastName, email, gender } }, // Update user fields
        { new: true } // Return the updated user
    ).select("-otp -refreshToken"); // Exclude sensitive fields

    return updatedUser;
};


// Handle Google login
const googleLogin = async ({ email, firstName, lastName, fcmToken }) => {
    let user = await User.findOne({ email });

    if (user) {
        user = await updateUser({ fcmToken }, user._id);
        return { data: user, message: 'User logged in successfully' };
    }

    const userName = `${firstName} ${lastName}`;
    user = await createUser({ email, fcmToken, userName, firstName, lastName });

    const { accessToken, refreshToken } = await generateUserAccessAndRefreshTokens(user._id);

    // Exclude sensitive information from the response
    const userData = await User.findById(user._id).select("-otp -refreshToken");

    return {
        ...userData.toObject(),
        accessToken,
        refreshToken
    };
};


// Handle Facebook login
const facebookLogin = async ({ facebookId, firstName, lastName, fcmToken }) => {
    let user = await User.findOne({ facebookId });

    if (user) {
        user = await updateUser({ fcmToken }, user._id);
        return { data: user, message: 'User logged in successfully' };
    }

    const userName = `${firstName} ${lastName}`;
    user = await createUser({ facebookId, fcmToken, userName, firstName, lastName });

    const { accessToken, refreshToken } = await generateUserAccessAndRefreshTokens(user._id);

    // Exclude sensitive information from the response
    const userData = await User.findById(user._id).select("-otp -refreshToken");

    return {
        ...userData.toObject(),
        accessToken,
        refreshToken
    };
};



const createUser = async (data) => {
    const user = new User(data);
    await user.save();
    return user;
};

export {
    generateOtp,
    verifyOtpAndLogin,
    updateUserProfileImage,
    updateUserProfile,
    googleLogin,
    facebookLogin
};
