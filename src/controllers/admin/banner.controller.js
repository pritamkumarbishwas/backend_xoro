import { createBanner, getAllBanners, getBannerById, updateBannerById, softDeleteBannerById } from '../services/bannerService.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

//  creating a new banner
const createBanner = asyncHandler(async (req, res) => {
    const newBanner = await createBanner(req.body);
    if (!newBanner) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create banner");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, newBanner, "Banner created successfully")
    );
});

//  fetching all active banners
const getAllBanners = asyncHandler(async (req, res) => {
    const banners = await getAllBanners();
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, banners, "Banners fetched successfully")
    );
});

//  fetching a single banner by ID
const getBannerById = asyncHandler(async (req, res) => {
    const banner = await getBannerById(req.params.id);
    if (!banner) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
    }
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, banner, "Banner fetched successfully")
    );
});

//  updating a banner by ID
const updateBannerById = asyncHandler(async (req, res) => {
    const updatedBanner = await updateBannerById(req.params.id, req.body);
    if (!updatedBanner) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
    }
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedBanner, "Banner updated successfully")
    );
});

//  soft deleting a banner by ID
const softDeleteBannerById = asyncHandler(async (req, res) => {
    const deletedBanner = await softDeleteBannerById(req.params.id);
    if (!deletedBanner) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
    }
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, deletedBanner, "Banner deleted successfully")
    );
});

export {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBannerById,
    softDeleteBannerById
};
