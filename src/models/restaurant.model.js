import mongoose from 'mongoose';
import Category from './category.model';

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],  // [longitude, latitude]
                required: true
            }
        }
    },
    CategoryId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    ],
    tagId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
            required: false
        }
    ],
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
        unique: true
    }
},
    { collection: 'Restaurant', timestamps: true }

);



// Middleware to filter out soft-deleted admins
const filterDeleted = function (next) {
    this.where({ isDeleted: false });
    next();
};

// Apply the filter to relevant queries
restaurantSchema.pre('find', filterDeleted);
restaurantSchema.pre('findOne', filterDeleted);
restaurantSchema.pre('findOneAndUpdate', filterDeleted);
restaurantSchema.pre('findByIdAndUpdate', filterDeleted);


export const Restaurant = mongoose.model('Restaurant', restaurantSchema);

