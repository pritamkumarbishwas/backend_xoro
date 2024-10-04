import mongoose from 'mongoose';

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
        enum: ['Admin', 'Restaurant'],  // 'Admin' for Super Admin, 'Restaurant' for Restaurant Admin
        default: 'Restaurant',
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: function () {
            return this.role === 'Restaurant';  // Restaurant admin must be linked to a restaurant
        },
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
}, {
    timestamps: true,  // Automatically manage createdAt and updatedAt fields
});

// Middleware to filter out soft-deleted admins
const filterDeleted = function (next) {
    this.where({ isDeleted: false });
    next();
};

// Apply the filter to relevant queries
adminSchema.pre('find', filterDeleted);
adminSchema.pre('findOne', filterDeleted);
adminSchema.pre('findOneAndUpdate', filterDeleted);
adminSchema.pre('findByIdAndUpdate', filterDeleted);

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
