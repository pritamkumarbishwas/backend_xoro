import Joi from 'joi';

// Schema for creating a new admin
const createAdmin = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(), // Adjust as per phone format
    role: Joi.string().valid('Admin', 'Restaurant').optional(),
    restaurant: Joi.string().optional(), // Assuming restaurant is a string
});

// Schema for updating an existing admin
const updateAdmin = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    phone: Joi.string().optional(),
    role: Joi.string().valid('Admin', 'Restaurant').optional(),
    restaurant: Joi.string().optional(),
});

// Schema for fetching an admin by ID
const getAdminById = Joi.object({
    id: Joi.string().required(), // Assuming ID is a string (like ObjectId)
});

// Schema for soft deleting an admin by ID
const softDeleteAdminById = Joi.object({
    id: Joi.string().required(), // Assuming ID is a string
});

// Schema for admin login
const adminLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Schema for changing admin password
const changePassword = {
    body: Joi.object().keys({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required(),
    }),
};

export {
    createAdmin,
    updateAdmin,
    getAdminById,
    softDeleteAdminById,
    adminLogin,
    changePassword,
};
