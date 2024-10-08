import * as RestaurantService from '../../services/restaurant.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Restaurant } from './../../models/restaurant.model';

// Create a new Admin
const createAdmin = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path; // Get the path of the uploaded file (if any)

    // Validate if avatar image is provided
    if (!avatarLocalPath) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Image file is missing");
    }

    // Create the Admin with form data and image
    const newAdmin = await AdminService.createAdmin({
        ...req.body, // Spread the request body (including role)
        avatar: avatarLocalPath // Set the avatar path
    });


    return res.status(httpStatus.CREATED).json(
        new ApiResponse(httpStatus.CREATED, newAdmin, "Admin created successfully")
    );
});

// Fetch all active Admins
const getAllAdmins = asyncHandler(async (req, res) => {
    const Admins = await AdminService.getAllAdmins();

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, Admins, "Admins fetched successfully")
    );
});

// Fetch a single Admin by ID
const getAdminById = asyncHandler(async (req, res) => {
    const Admin = await AdminService.getAdminById(req.params.id);

    if (!Admin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, Admin, "Admin fetched successfully")
    );
});

// Update an Admin by ID
const updateAdminById = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path; // Get the path of the uploaded file (if any)

    // Merge the update data, including the image if provided
    const updatedAdmin = await AdminService.updateAdminById(req.params.id, {
        ...req.body,
        avatar: avatarLocalPath || req.body.avatar // Update avatar if a new image is provided
    });

    if (!updatedAdmin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedAdmin, "Admin updated successfully")
    );
});

// Soft delete an Admin by ID (logical deletion)
const softDeleteAdminById = asyncHandler(async (req, res) => {
    const deletedAdmin = await AdminService.softDeleteAdminById(req.params.id);

    if (!deletedAdmin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, deletedAdmin, "Admin deleted successfully")
    );
});


// admin login - generates OTP
const adminLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Generate OTP and get user info
    const response = await AdminService.adminLogin(email, password);

    // Send OTP response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, response, "Login successfully")
    );

});

// Admin logout - invalidates refresh token
const adminLogout = asyncHandler(async (req, res) => {
    const adminId = req.user.id; // Assuming `req.user` contains the authenticated admin's ID

    // Call the adminLogout service function
    const response = await AdminService.adminLogout(adminId);

    // Send the response back to the client
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, response, "Logout successful")
    );
});

// Admin password change 
const changeAdminPassword = asyncHandler(async (req, res) => {
    const adminId = req.user._id;  // Assuming `req.user` is set through authentication middleware
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
        return res.status(httpStatus.BAD_REQUEST).json(
            new ApiResponse(httpStatus.BAD_REQUEST, null, 'Current and new password are required')
        );
    }

    // Call the changePassword function
    const response = await AdminService.changePassword(adminId, currentPassword, newPassword);

    // Send success response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, response, 'Password changed successfully')
    );
});




export {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdminById,
    softDeleteAdminById,
    adminLogin,
    adminLogout,
    changeAdminPassword,
};
