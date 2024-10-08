import Joi from 'joi';

// Validation schema for creating a tag
const createTag = {
    body: Joi.object().keys({
        title: Joi.string().min(3).max(100).required(),  // Title is required and must meet length requirements
        status: Joi.string().valid('Active', 'Block').required(),  // Valid status values ('Active', 'Block')
    }),
};

// Validation schema for fetching a tag by ID
const getTagById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),  // ID must be a valid 24-character hex string
    }),
};

// Validation schema for updating a tag by ID
const updateTagById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),  // ID must be a valid 24-character hex string
    }),
    body: Joi.object().keys({
        title: Joi.string().min(3).max(100).optional(),  // Title is optional but must meet length requirements if provided
        status: Joi.string().valid('Active', 'Block').optional(),  // Status is optional but must be 'Active' or 'Block' if provided
    }),
};

// Validation schema for soft deleting a tag by ID
const softDeleteTagById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),  // ID must be a valid 24-character hex string
    }),
};

export {
    createTag,
    getTagById,
    updateTagById,
    softDeleteTagById,
};
