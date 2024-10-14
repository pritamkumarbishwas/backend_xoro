import { ApiError } from "../../utils/ApiError.js";
import { TermCondition } from "../../models/term.condition.model.js";

// Get all terms and conditions
const getTermCondition = async () => {
    const terms = await TermCondition.find({});
    return terms || null;
};

// Get active terms and conditions for users
const getUsersTermCondition = async () => {
    const term = await TermCondition.findOne({ page: "User", status: "Active" });
    return term || null;
};

// Get active terms and conditions for admin
const getAdminTermCondition = async () => {
    const term = await TermCondition.findOne({ page: "Admin", status: "Active" });
    return term || null;
};

// Get a term and condition by ID
const getTermConditionById = async (id) => {
    const term = await TermCondition.findById(id);
    return term || null;
};

// Add a new term and condition
const addNewTermCondition = async (body) => {
    const { title, page, description, status } = body;
    const newTerm = await TermCondition.create({ title, page, description, status });
    return newTerm;
};

// Update an existing term and condition
const updateTermCondition = async (id, body) => {
    const { title, page, description, status } = body;

    if (!id) {
        throw new ApiError(400, "id is required.");
    }

    // Find the TermCondition by ID
    const term = await TermCondition.findById(id);
    if (!term) {
        throw new ApiError(404, "Term and Condition not found.");
    }

    // Update term properties
    term.title = title || term.title;
    term.description = description || term.description;
    term.page = page || term.page;
    term.status = status || term.status;

    // Save the updated term
    await term.save();

    return term;
};

// Change the status of a term and condition
const changeStatus = async (id, status) => {
    if (!id) {
        throw new ApiError(400, "id is required.");
    }

    const term = await TermCondition.findById(id);
    if (!term) {
        throw new ApiError(404, "Term and Condition not found.");
    }

    term.status = status;
    await term.save();

    return term;
};

// Delete a term and condition by ID
const deleteTermCondition = async (id) => {
    if (!id) {
        throw new ApiError(400, "id is required.");
    }

    const deletedTerm = await TermCondition.findByIdAndDelete(id);
    if (!deletedTerm) {
        throw new ApiError(404, "Term and Condition not found.");
    }

    return deletedTerm;
};

export {
    getTermCondition,
    getUsersTermCondition,
    getAdminTermCondition,
    getTermConditionById,
    addNewTermCondition,
    updateTermCondition,
    changeStatus,
    deleteTermCondition,
};
