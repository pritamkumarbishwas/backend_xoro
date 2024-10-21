import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

// User schema definition
const userSchema = new Schema(
    {
        firstName: {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
        },
        lastName: {
            type: String,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            default: null,
            index: true, // Single index for email
        },
        phone: {
            type: String, // String to handle leading zeroes
            default: null,
            index: true, // Single index for phone
        },
        gender: {
            type: String,
            enum: ['', 'Male', 'Female', 'Other'],
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        },
        facebookId: {
            type: String,
            default: ''
        },
        googleId: {
            type: String,
            default: ''
        },
        otp: {
            code: {
                type: Number,
                default: null
            },
            expiresAt: {
                type: Date,
                default: null
            }
        },
        addresses: [
            {
                area: {
                    type: String,
                    default: null,
                },
                landmark: {
                    type: String,
                    default: null,
                },
                addressTitle: {
                    type: String,
                    default: null,
                },
                zipCode: {
                    type: String,
                    default: null,
                }
            }
        ],
        fcmToken: {
            type: String,
            default: ''
        },
        referCode: {
            type: String,
            unique: true
        },
        loggedInDevice: {
            type: String,
            default: ''
        },
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        deviceId: {
            type: String,
            default: ''
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['Active', 'Blocked'],
            default: 'Active'
        },
        walletBalance: {
            type: Number,
            default: 0
        },
        refreshToken: {
            type: String,
            default: ''
        },
    },
    { collection: 'User', timestamps: true }
);

// Multiple field index for firstName, email, and phone
userSchema.index({ firstName: 1, email: 1, phone: 1 });

// Function to generate a unique refer code
async function generateUniqueReferCode() {
    let referCode;
    let codeExists = true;
    while (codeExists) {
        referCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        codeExists = await User.exists({ referCode });
    }
    return referCode;
}

// Pre-save hook to generate refer code if it doesn't exist
userSchema.pre('save', async function (next) {
    if (!this.referCode) {
        try {
            this.referCode = await generateUniqueReferCode();
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Exclude deleted users from query results
function excludeDeleted(next) {
    this.where({ isDeleted: { $ne: true } });
    next();
}

userSchema.pre('find', excludeDeleted);
userSchema.pre('findOne', excludeDeleted);
userSchema.pre('findOneAndUpdate', excludeDeleted);
userSchema.pre('findById', excludeDeleted);

// Instance method to generate an access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// Instance method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id }, // Payload with user ID
        process.env.REFRESH_TOKEN_SECRET, // Secret for signing the refresh token
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Expiration time for the refresh token
    );
};

// Export the User model
export const User = mongoose.model("User", userSchema);
