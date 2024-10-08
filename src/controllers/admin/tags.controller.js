import * as TagService from '../../services/tag.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// Creating a new Tag
const createTag = asyncHandler(async (req, res) => {
    const newTag = await TagService.createTag(req.body);

    if (!newTag) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create Tag.");
    }

    return res.status(httpStatus.CREATED).json(
        new ApiResponse(httpStatus.CREATED, newTag, "Tag created successfully")
    );
});

// Fetching all Tags
const getAllTags = asyncHandler(async (req, res) => {
    const tags = await TagService.getAllTags();

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, tags, "Tags fetched successfully")
    );
});

// Fetching a single Tag by ID
const getTagById = asyncHandler(async (req, res) => {
    const tag = await TagService.getTagById(req.params.id);

    if (!tag) {
        throw new ApiError(httpStatus.NOT_FOUND, "Tag not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, tag, "Tag fetched successfully")
    );
});

// Updating a Tag by ID
const updateTagById = asyncHandler(async (req, res) => {
    const updatedTag = await TagService.updateTagById(req.params.id, req.body);

    if (!updatedTag) {
        throw new ApiError(httpStatus.NOT_FOUND, "Tag not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedTag, "Tag updated successfully")
    );
});

// Soft deleting a Tag by ID
const softDeleteTagById = asyncHandler(async (req, res) => {
    const deletedTag = await TagService.softDeleteTagById(req.params.id);

    if (!deletedTag) {
        throw new ApiError(httpStatus.NOT_FOUND, "Tag not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, {}, "Tag deleted successfully")
    );
});

export {
    createTag,
    getAllTags,
    getTagById,
    updateTagById,
    softDeleteTagById
};
