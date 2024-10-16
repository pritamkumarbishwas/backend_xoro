import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    transactionType: {
        type: String,
        enum: [
            'credit',
            'debit',
            'cashback',
            'voucher',
            'gift-card',
            'coin',
            'coupon',
            'points',
        ],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0, // Ensures that amount cannot be negative
    },
    currency: {
        type: String,
        default: 'INR', // Set default currency to INR
        required: true, // Added required to ensure currency is always set
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'reversed'],
        default: 'pending', // Default transaction status
    },
    transactionDate: {
        type: Date,
        default: Date.now, // Default to the current date and time
    },
    referenceId: {
        type: String,
        unique: true,
        sparse: true, // Unique constraint, allowing multiple nulls
    },
    description: {
        type: String,
        default: '', // Default to an empty string
    },
    metadata: {
        type: Map,
        of: String, // Allows for flexible additional data
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
});

// Index for quick retrieval of transactions by userId and transactionDate
transactionSchema.index({ userId: 1, transactionDate: -1 });

export const UserTransaction = model('UserTransaction', transactionSchema);
