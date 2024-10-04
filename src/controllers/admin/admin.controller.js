import * as AdminService from '../../services/admin.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

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

export {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdminById,
    softDeleteAdminById
};
