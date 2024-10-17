import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userCouponSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    couponId: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
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
    collection: "UserCoupon", // Corrected: use lowercase 'collection'
    timestamps: true
});

export const UserCoupon = model('UserCoupon', userCouponSchema);
