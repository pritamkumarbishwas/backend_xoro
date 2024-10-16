// src/models/giftCard.model.js
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const { Schema, model } = mongoose;

const giftCardSchema = new Schema(
    {
        code: {
            type: String,
            unique: true,
        },
        pin: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^\d{6}$/.test(v); 
                },
                message: (props) => `${props.value} is not a valid 6-digit PIN!`,
            },
        },
        value: {
            type: Number,
            required: true,
            min: 0, // Ensures value is non-negative
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Optional, as a gift card might not be associated with a user initially
        },
        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: false, // Optional, as a gift card might not be associated with a user initially
        },
        giftCardCategoryId: {
            type: Schema.Types.ObjectId,
            ref: 'GiftCardCategory',
            required: true, // Category is required to categorize the gift card
        },
        status: {
            type: String,
            enum: ['Active', 'Redeemed', 'Expired'],
            default: 'Active', // Default status when a gift card is created
        },
        expiryDate: {
            type: Date,
            default: () => {
                const currentDate = new Date();
                currentDate.setFullYear(currentDate.getFullYear() + 1); // Default expiry date is set to 1 year from now
                return currentDate; // Return the new date
            },
        },
    },
    {
        collection: 'GiftCard',
        timestamps: true, // Automatically manages createdAt and updatedAt timestamps
    }
);

// Generate a unique gift card code
const generateUniqueCode = async function () {
    let code;
    let isUnique = false;
    while (!isUnique) {
        code = nanoid(16); // Generates a random 16-character code
        const existingCode = await GiftCard.findOne({ code });
        if (!existingCode) {
            isUnique = true; // Ensure the generated code is unique
        }
    }
    return code;
};

// Function to generate a random 6-digit PIN
const generateRandomPin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number
};

// Middleware to handle automated generation of code and PIN
giftCardSchema.pre('save', async function (next) {
    // Log this to check if the middleware is hit
    // console.log('Pre-save middleware triggered');

    // Generate a new code if this is a new document and no code is provided
    if (this.isNew) {
        if (!this.code) {
            try {
                this.code = await generateUniqueCode();
            } catch (error) {
                return next(new Error('Error generating unique code: ' + error.message));
            }
        }

        // Generate a new PIN if this is a new document and no PIN is provided
        if (!this.pin) {
            this.pin = generateRandomPin(); // Assign a random 6-digit PIN
        }
    }

    // Proceed to save
    next();
});

export const GiftCard = model('GiftCard', giftCardSchema);
