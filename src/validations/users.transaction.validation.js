import Joi from 'joi';

// Validation schema for creating a new transaction
const createTransaction = {
    body: Joi.object().keys({
        transactionType: Joi.string().valid('credit', 'debit', 'cashback', 'points', 'gift-card', 'voucher', 'coin', 'coupon').required(),
        amount: Joi.number().required().min(0),
        description: Joi.string().optional().max(500),
        currency: Joi.string().valid('INR').default('INR')
    }),
};

// Validation schema for fetching a transaction by ID
const getTransactionById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
};

export {
    createTransaction,
    getTransactionById
};
