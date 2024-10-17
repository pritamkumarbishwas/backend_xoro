import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userVoucherSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    voucherId: { // Changed from couponId to voucherId
        type: Schema.Types.ObjectId,
        ref: 'Voucher', // Changed from Coupon to Voucher to match the model
        required: true
    },
    timesUsed: {
        type: Number,
        default: 0
    },
    lastUsedDate: {
        type: Date
    }
}, {
    collection: "UserVoucher", // Collection name should typically be pluralized and in lowercase
    timestamps: true
});

export const UserVoucher = model('UserVoucher', userVoucherSchema);
