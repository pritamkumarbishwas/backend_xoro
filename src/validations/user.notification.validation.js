import Joi from 'joi';

// Validation schema for creating a new User Notification
const createUserNotification = {
    body: Joi.object().keys({
        name: Joi.string().required().max(255),
        email: Joi.string().email().required(), // Validate email format
        phone: Joi.string().required().pattern(/^[0-9]+$/), // Validate phone as a string of digits
    }),
};

// Validation schema for fetching a User Notification by ID
const getUserNotificationById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
};

// Validation schema for updating a User Notification by ID
const updateUserNotificationById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
    body: Joi.object().keys({
        name: Joi.string().max(255), // Make name optional on update
        email: Joi.string().email().required(), // Validate email format
        phone: Joi.string().pattern(/^[0-9]+$/), // Validate phone as a string of digits
    }).min(1), // Ensure at least one field is provided for update
};

// Validation schema for soft deleting a User Notification by ID
const softDeleteUserNotificationById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
};

export {
    createUserNotification,
    getUserNotificationById,
    updateUserNotificationById,
    softDeleteUserNotificationById,
};
