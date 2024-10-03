import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Block'],
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { collection: 'Banner', timestamps: true });

const filterDeleted = function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
};

// Apply the filterDeleted middleware to all find operations
bannerSchema.pre('find', filterDeleted);
bannerSchema.pre('findOne', filterDeleted);
bannerSchema.pre('findOneAndUpdate', filterDeleted);
bannerSchema.pre('findById', filterDeleted);


export const Banners = mongoose.model("Banner", bannerSchema);

