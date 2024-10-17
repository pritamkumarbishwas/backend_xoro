import Joi from 'joi';

// Validation schema for creating a gift card 
const createGiftCard = {
    body: Joi.object().keys({
        value: Joi.number().positive().required(),
        giftCardCategoryId: Joi.string().hex().length(24).required(),
        status: Joi.string().valid('Active', 'Redeemed', 'Expired').optional(),
    }),
};

// Validation schema for creating a gift card 
const createUserGiftCard = {
    body: Joi.object().keys({
        value: Joi.number().positive().required(),
        giftCardCategoryId: Joi.string().hex().length(24).required(),
    }),
};

// Validation schema for fetching a gift card by ID
const getById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
};
// Validation schema for fetching a gift card by ID
const redem = {
    body: Joi.object().keys({
        giftCardCode: Joi.string().required(),
        pin: Joi.string().required(),
    }),
};

// Validation schema for updating a gift card by ID
const updateById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
    body: Joi.object().keys({
        value: Joi.number().positive().optional(), 
        giftCardCategoryId: Joi.string().hex().length(24).optional(),
        status: Joi.string().valid('Active', 'Redeemed', 'Expired').optional(), 
    }),
};

// Validation schema for updating a gift card by ID
const updateExpiaryDateById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
    body: Joi.object().keys({
        expiryDate: Joi.date().required(),
    }),
};

// Validation schema for soft deleting a gift card by ID
const softDeleteById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
};

export {
    createGiftCard,
    getById,
    updateById,
    updateExpiaryDateById,
    softDeleteById,
    createUserGiftCard,
    redem
};
