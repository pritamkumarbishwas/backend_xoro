import * as Transactions from '../../services/admin/user.transaction.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// Get all transactions for a user
const getUserTransactions = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const transactions = await Transactions.getUserTransactions(userId);

    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, transactions, "Transactions fetched successfully."));
});

// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const transaction = await Transactions.createTransaction(userId, req.body);

    if (!transaction) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction creation failed');
    }

    res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, transaction, "Transactions Created successfully."));
});

// Get a transaction by ID
const getTransactionById = asyncHandler(async (req, res) => {
    const transactionId = req.params.id;
    const transaction = await Transactions.getTransactionById(transactionId);

    if (!transaction) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }

    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, transaction, "Transactions fetched successfully."));
});


export {
    getUserTransactions,
    createTransaction,
    getTransactionById,
};
