import { UserTransaction } from '../../models/user.wallet.transaction.model.js';
import Wallet from '../../models/user.wallet.model.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from "http-status";

// Function to create a new transaction and update wallet balance
const createTransaction = async (userId, data) => {
    const { description, currency, transactionType, amount } = data;

    const session = await UserTransaction.startSession();
    session.startTransaction();

    try {
        console.log("Creating transaction with data:", data); // Log input data

        const transactionData = { userId, description, currency, transactionType, amount, status: "completed" };
        const transaction = await UserTransaction.create([transactionData], { session });

        // Retrieve or create user's wallet
        let wallet = await Wallet.findOne({ userId }).session(session);
        if (!wallet) {
            wallet = await Wallet.create({ userId, balance: 0 }, { session }); // Fix here
        }

        // Update wallet balance based on transaction type
        if (transactionType === 'credit' || transactionType === 'cashback' || transactionType === 'points') {
            wallet.balance += amount;
        } else if (transactionType === 'debit' || transactionType === 'fee') {
            wallet.balance -= amount;
        }

        // Save updated wallet
        await wallet.save({ session }); // Ensure wallet is a Mongoose document

        await session.commitTransaction();
        session.endSession();

        return transaction[0]; // Returns the first element of the transaction array
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction creation error:", error); // Log error details
        throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction creation failed: ' + error.message);
    }
};

// Function to fetch all transactions for a specific user
const getUserTransactions = async (userId) => {
    const transactions = await UserTransaction.find({ userId }).sort({ transactionDate: -1 });
    return transactions;
};

// Function to fetch a specific transaction by ID
const getTransactionById = async (id) => {
    const transaction = await UserTransaction.findById(id);
    if (!transaction) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }
    return transaction;
};

export { createTransaction, getUserTransactions, getTransactionById };
