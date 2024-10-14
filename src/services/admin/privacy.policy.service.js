import { ApiError } from "../../utils/ApiError.js";
import { PrivacyPolicy } from "../../models/privacy.policy.model.js";

// Get all terms and conditions
const getPrivacyPolicy = async () => {
    const terms = await PrivacyPolicy.find({});
    return terms || null;
};

// Get active terms and conditions for users
const getUsersPrivacyPolicy = async () => {
    const term = await PrivacyPolicy.findOne({ page: "User", status: "Active" });
    return term || null;
};

// Get active terms and conditions for admin
const getAdminPrivacyPolicy = async () => {
    const term = await PrivacyPolicy.findOne({ page: "Admin", status: "Active" });
    return term || null;
};

// Get a term and condition by ID
const getPrivacyPolicyById = async (id) => {
    const term = await PrivacyPolicy.findById(id);
    return term || null;
};

// Add a new term and condition
const addNewPrivacyPolicy = async (body) => {
    const { title, page, description, status } = body;
    const newTerm = await PrivacyPolicy.create({ title, page, description, status });
    return newTerm;
};

// Update an existing term and condition
const updatePrivacyPolicy = async (id, body) => {
    const { title, page, description, status } = body;

    if (!id) {
        throw new ApiError(400, "id is required.");
    }

    // Find the PrivacyPolicy by ID
    const term = await PrivacyPolicy.findById(id);
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

    const term = await PrivacyPolicy.findById(id);
    if (!term) {
        throw new ApiError(404, "Term and Condition not found.");
    }

    term.status = status;
    await term.save();

    return term;
};

// Delete a term and condition by ID
const deletePrivacyPolicy = async (id) => {
    if (!id) {
        throw new ApiError(400, "id is required.");
    }

    const deletedTerm = await PrivacyPolicy.findByIdAndDelete(id);
    if (!deletedTerm) {
        throw new ApiError(404, "Term and Condition not found.");
    }

    return deletedTerm;
};

export {
    getPrivacyPolicy,
    getUsersPrivacyPolicy,
    getAdminPrivacyPolicy,
    getPrivacyPolicyById,
    addNewPrivacyPolicy,
    updatePrivacyPolicy,
    changeStatus,
    deletePrivacyPolicy,
};
