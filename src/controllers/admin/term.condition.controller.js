import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import * as TermConditionService from '../../services/admin/term.condition.service.js';
import httpStatus from 'http-status';

// Get the list of all terms and conditions
const termList = asyncHandler(async (req, res) => {
    const terms = await TermConditionService.getTermCondition();
    return res
        .status(httpStatus.OK)
        .json(new ApiResponse(httpStatus.OK, terms, "Terms and conditions fetched successfully."));
});

// Get a specific term and condition by ID
const getTermById = asyncHandler(async (req, res) => {
    const term = await TermConditionService.getTermConditionById(req.params.id);

    if (!term) {
        throw new ApiError(httpStatus.NOT_FOUND, "No term and condition found with the specified ID.");
    }

    return res
        .status(httpStatus.OK)
        .json(new ApiResponse(httpStatus.OK, term, "Term and condition fetched successfully."));
});

// Add a new term and condition
const addNewTerm = asyncHandler(async (req, res) => {
    const term = await TermConditionService.addNewTermCondition(req.body);

    if (!term) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Term and condition could not be added.");
    }

    return res
        .status(httpStatus.CREATED)
        .json(new ApiResponse(httpStatus.CREATED, term, "Term and condition added successfully."));
});

// Update an existing term and condition
const updateTerm = asyncHandler(async (req, res) => {
    const term = await TermConditionService.updateTermCondition(req.params.id,req.body);

    if (!term) {
        throw new ApiError(httpStatus.NOT_FOUND, "Term and condition could not be updated.");
    }

    return res
        .status(httpStatus.OK)
        .json(new ApiResponse(httpStatus.OK, term, "Term and condition updated successfully."));
});

// Change the status of a term and condition
const changeStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const term = await TermConditionService.changeStatus(req.params.id, status);

    if (!term) {
        throw new ApiError(httpStatus.NOT_FOUND, "No term and condition found with the specified ID.");
    }

    return res
        .status(httpStatus.OK)
        .json(new ApiResponse(httpStatus.OK, term, "Term and condition status updated successfully."));
});

// Delete a term and condition by ID
const deleteTerm = asyncHandler(async (req, res) => {
   
    const deletedTerm = await TermConditionService.deleteTermCondition(req.params.id);

    if (!deletedTerm) {
        throw new ApiError(httpStatus.NOT_FOUND, "No term and condition found with the specified ID.");
    }

    return res
        .status(httpStatus.OK)
        .json(new ApiResponse(httpStatus.OK, {}, "Term and condition deleted successfully."));
});

export {
    termList,
    getTermById,
    addNewTerm,
    updateTerm,
    changeStatus,
    deleteTerm,
};
