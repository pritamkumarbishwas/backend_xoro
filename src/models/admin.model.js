import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => /^\d{10}$/.test(value),
            message: 'Invalid mobile number'
        },
    },
    role: {
        type: String,
        enum: ['Admin', 'Restaurant', 'Freanchies'],  // 'Admin' for Super Admin, 'Restaurant' for Restaurant Admin
        default: 'Restaurant',
        required: true,
    },
    fcmToken: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: 'default.png'  // Default avatar image
    },
    isDeleted: {
        type: Boolean,
        default: false,  // Soft delete flag
    }
},
    { collection: 'Admin', timestamps: true }
);

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Instance method to generate an access token
adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
    );
};

// Instance method to generate a refresh token
adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d' }
    );
};


// Middleware to filter out soft-deleted admins
const filterDeleted = function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
};

// Apply the filter to relevant queries
adminSchema.pre('find', filterDeleted);
adminSchema.pre('findOne', filterDeleted);
adminSchema.pre('findOneAndUpdate', filterDeleted);
adminSchema.pre('findByIdAndUpdate', filterDeleted);

export const Admin = mongoose.model('Admin', adminSchema);

