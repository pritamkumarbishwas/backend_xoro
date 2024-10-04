import Admin from '../models/admin.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs'; // To hash passwords

// Helper function to check for email or phone uniqueness
const checkUniqueFields = async (email, phone, excludeId = null) => {
    const emailExists = await Admin.findOne({ email, _id: { $ne: excludeId } });
    if (emailExists) {
        throw new ApiError(httpStatus.CONFLICT, 'Email is already taken');
    }
    const phoneExists = await Admin.findOne({ phone, _id: { $ne: excludeId } });
    if (phoneExists) {
        throw new ApiError(httpStatus.CONFLICT, 'Phone number is already taken');
    }
};

// Function to create a new Admin
const createAdmin = async (req, avatarLocalPath) => {
    const { name, email, password, phone, role, restaurant } = req.body;
    const addedBy = req?.user?._id ?? null;

    // Check if email or phone already exists
    await checkUniqueFields(email, phone);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload the avatar to Cloudinary using the local file path
    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;

    // Check if the Cloudinary upload was successful if an image was provided
    if (avatarLocalPath && !avatar?.url) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while uploading avatar');
    }

    // Prepare Admin data with Cloudinary URL if available
    const adminData = {
        name,
        email,
        password: hashedPassword, // Store hashed password
        phone,
        role: role || 'Restaurant',  // Default to 'Restaurant' if role is not provided
        restaurant: role === 'Restaurant' ? restaurant : null,  // Only include restaurant if role is 'Restaurant'
        avatar: avatar?.url || 'default.png', // Use the uploaded avatar or default
        addedBy,
    };

    // Create a new Admin using the processed data
    const newAdmin = new Admin(adminData);

    // Save the new Admin to the database
    return await newAdmin.save();
};

// Function to fetch all Admins (excluding deleted)
const getAllAdmins = async () => {
    return await Admin.find(); // Middleware automatically filters deleted admins
};

// Function to fetch all active Admins (excluding deleted or blocked)
const getAllActiveAdmins = async () => {
    return await Admin.find({ status: 'Active' }); // Fetch only active Admins, excluding deleted
};

// Function to fetch an Admin by ID (excluding deleted)
const getAdminById = async (id) => {
    const admin = await Admin.findById(id).populate('restaurant'); // Populate restaurant details if applicable

    // Check if Admin exists
    if (!admin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    return admin;
};

// Function to update an Admin by ID
const updateAdminById = async (id, data, avatarLocalPath) => {
    const { name, email, phone, role, restaurant, fcmToken } = data;

    // Check if email or phone already exists (excluding current admin)
    await checkUniqueFields(email, phone, id);

    const updateData = {}; // Initialize an empty object for the fields to be updated

    // Check if avatarLocalPath exists, then upload the new image and update the image URL
    if (avatarLocalPath) {
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (avatar?.url) {
            updateData.avatar = avatar.url; // Add the new avatar URL to updateData
        } else {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while uploading avatar');
        }
    }

    // Update all other fields if they are provided in the request data
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (role) {
        updateData.role = role;
        updateData.restaurant = role === 'Restaurant' ? restaurant : null;  // Update restaurant based on role
    }
    if (fcmToken) updateData.fcmToken = fcmToken;

    // Update the Admin with the new data
    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true });

    // Check if the Admin exists and was updated
    if (!updatedAdmin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    return updatedAdmin; // Return the updated document
};

// Function to soft delete an Admin by ID
const softDeleteAdminById = async (id) => {
    const admin = await Admin.findById(id);

    // Check if the Admin was found and is already soft deleted
    if (!admin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }
    if (admin.isDeleted) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Admin is already deleted');
    }

    // Soft delete the Admin
    admin.isDeleted = true;
    await admin.save();

    return admin; // Return the soft deleted document
};

export {
    createAdmin,
    getAllAdmins,
    getAllActiveAdmins,
    getAdminById,
    updateAdminById,
    softDeleteAdminById
};
