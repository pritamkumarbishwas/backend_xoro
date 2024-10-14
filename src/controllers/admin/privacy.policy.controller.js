import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import * as PrivacyPolicyService from '../../services/admin/privacy.policy.service.js';
import httpStatus from 'http-status';

// Get the list of all Privacy Policies
const privacyList = asyncHandler(async (req, res) => {
    const result = await PrivacyPolicyService.getPrivacyPolicy();
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, result, "Privacy Policies fetched successfully.")
    );
});

// Get a specific Privacy Policy by ID
const getPrivacyById = asyncHandler(async (req, res) => {
    const result = await PrivacyPolicyService.getPrivacyPolicyById(req.params.id);

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Privacy Policy found with the specified ID.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, result, "Privacy Policy fetched successfully.")
    );
});

// Add a new Privacy Policy
const addNewPrivacy = asyncHandler(async (req, res) => {
    const result = await PrivacyPolicyService.addNewPrivacyPolicy(req.body);

    if (!result) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Privacy Policy could not be added.");
    }

    return res.status(httpStatus.CREATED).json(
        new ApiResponse(httpStatus.CREATED, result, "Privacy Policy added successfully.")
    );
});

// Update an existing Privacy Policy
const updatePrivacy = asyncHandler(async (req, res) => {
    const result = await PrivacyPolicyService.updatePrivacyPolicy(req.params.id, req.body);

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Privacy Policy could not be updated.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, result, "Privacy Policy updated successfully.")
    );
});

// Change the status of a Privacy Policy
const changeStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const result = await PrivacyPolicyService.changeStatus(req.params.id, status);

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Privacy Policy found with the specified ID.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, result, "Privacy Policy status updated successfully.")
    );
});

// Delete a Privacy Policy by ID
const deletePrivacy = asyncHandler(async (req, res) => {
    const result = await PrivacyPolicyService.deletePrivacyPolicy(req.params.id);

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Privacy Policy found with the specified ID.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, {}, "Privacy Policy deleted successfully.")
    );
});

export {
    privacyList,
    getPrivacyById,
    addNewPrivacy,
    updatePrivacy,
    changeStatus,
    deletePrivacy,
};
