import mongoose from 'mongoose';
import Category from './category.model';

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    CategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',  // Reference to Category schema
        required: true  // At least one category is required
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',  // Reference to Admin schema
        required: true,
        unique: true  // Ensure one admin per restaurant
    }
}, {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
