import { Restaurant } from '../models/restaurant.model.js';
import { Admin } from '../models/admin.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import httpStatus from 'http-status';
import bcrypt from "bcrypt";

import { generateAdminAccessAndRefreshTokens } from "../utils/tokenUtils.js";

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


// Function to create a new Restaurant
const createRestaurant = async (req, avatarLocalPath, imageLocalPath) => {
    const { name, email, password, phone, title, categoryId, tagId, address, city, state, zipCode, coordinates } = req.body; // Destructure location
    const addedBy = req?.user?._id;

    // Check if email or phone already exists
    await checkUniqueFields(email, phone);

    // Upload the avatar to Cloudinary using the local file path
    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;

    // Upload the Restaurant image to Cloudinary using the local file path
    const image = imageLocalPath ? await uploadOnCloudinary(imageLocalPath) : null;

    // Check if the Cloudinary upload was successful if an image was provided
    if (avatarLocalPath && !avatar?.url) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while uploading avatar');
    }

    // Prepare Admin data with Cloudinary URL if available
    const adminData = {
        name,
        email,
        password,
        phone,
        role: "Restaurant",
        avatar: avatar?.url || '', // Use the uploaded avatar or default
        addedBy,
    };

    // Create a new Admin using the processed data
    const newAdmin = new Admin(adminData);

    try {
        // Save the new Admin to the database
        const savedAdmin = await newAdmin.save();

        // If admin is saved successfully, create the restaurant
        const restaurantData = {
            title,
            categoryId,
            tagId,
            address,
            city,
            state,
            zipCode,
            coordinates,
            image: image?.url || '',
            adminId: savedAdmin._id
        };

        const newRestaurant = new Restaurant(restaurantData);
        const savedRestaurant = await newRestaurant.save();

        const populatedRestaurant = await Restaurant.findById(savedRestaurant._id).populate('adminId');
        return populatedRestaurant;
    } catch (error) {
        // If an error occurs, delete the admin if it was created
        if (newAdmin._id) {
            await Admin.findByIdAndDelete(newAdmin._id);
        }
        // Rethrow the error for further handling
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
};



// Function to fetch all Restaurants (excluding deleted)
const getAllRestaurants = async () => {
    return await Restaurant.find().populate('adminId'); // Middleware automatically filters deleted Restaurants
};

// Function to fetch all active Restaurants (excluding deleted or blocked)
const getAllActiveRestaurants = async () => {
    return await Restaurant.find({ status: 'Active' }).populate('adminId'); // Fetch only active Restaurants, excluding deleted
};

// Function to fetch an Restaurant by ID (excluding deleted)
const getRestaurantById = async (id) => {
    const restaurant = await Restaurant.findById(id).populate('adminId'); // Populate restaurant details if applicable

    // Check if Restaurant exists
    if (!restaurant) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    return restaurant;
};

// Function to update an Restaurant by ID
const updateRestaurantById = async (id, data, avatarLocalPath) => {
    const { name, email, phone, role, restaurant, fcmToken } = data;

    // Check if email or phone already exists (excluding current Restaurant)
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

    // Update the Restaurant with the new data
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updateData, { new: true });

    // Check if the Restaurant exists and was updated
    if (!updatedRestaurant) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    return updatedRestaurant; // Return the updated document
};

// Function to soft delete a Restaurant by ID
const softDeleteRestaurantById = async (id) => {
    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(id); // Corrected to find Restaurant instead of Admin

    // Check if the Restaurant was found and is already soft deleted
    if (!restaurant) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    if (restaurant.isDeleted) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Restaurant is already deleted');
    }

    // Soft delete the Restaurant
    restaurant.isDeleted = true;
    await restaurant.save();

    // Soft delete the corresponding Admin as well
    const adminId = restaurant.adminId; // Get the associated Admin ID
    const admin = await Admin.findById(adminId); // Find the Admin by ID

    if (admin) { // Check if the Admin exists
        admin.isDeleted = true; // Soft delete the Admin
        await admin.save(); // Save the changes
    }

    return restaurant; // Return the soft deleted restaurant
};

const restaurantLogin = async (email, password) => {
    // Find the Restaurant by email
    const restaurant = await Admin.findOne({ email, isDeleted: false });

    // Check if the Restaurant exists
    if (!restaurant) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, restaurant.password);
    if (!isPasswordValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    // Generate access and refresh tokens for the authenticated Restaurant
    const { accessToken, refreshToken } = await generateAdminAccessAndRefreshTokens(restaurant._id);

    // const adminData = await Admin.findById(restaurant._id).select("-password -refreshToken");
    const restaurantData = await Restaurant.find({ adminId: restaurant._id }).select("-password -refreshToken").populate('adminId');

    // console.log(restaurantData);
    return {
        restaurantData,
        accessToken,
        refreshToken
    };
};

const restaurantChangePassword = async (restaurantId, oldPassword, newPassword) => {
    // Find the Restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    // Check if the Restaurant exists
    if (!restaurant) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    // Verify the old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, restaurant.password);
    if (!isOldPasswordValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the Restaurant's password
    restaurant.password = hashedPassword;
    await restaurant.save();

    return { message: 'Password updated successfully' };
};

const restaurantLogout = async (restaurantId) => {
    // Find the Restaurant by ID
    const admin = await Admin.findById(restaurantId);

    // Check if the Restaurant exists
    if (!admin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    // Invalidate the refresh token by removing it from the database (or setting it to null)
    admin.refreshToken = null;
    await admin.save();

    return { message: 'Logged out successfully' };
};

const changePassword = async (adminId, currentPassword, newPassword) => {
    const admin = await Admin.findById(adminId);
    // Check if the admin exists
    if (!admin || admin.isDeleted) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    // Check if the current password is correct using the schema method
    const isPasswordValid = await admin.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
    }

    // Update the admin's password with the new password
    admin.password = newPassword;  // The pre-save hook will handle hashing
    await admin.save();

    return admin;
};

const updateAddress = async (id, data) => {
    // Check if the Admin exists
    // Find the Restaurant associated with the Admin ID
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    // Update the Restaurant's address details
    restaurant.address = data.address || restaurant.address;
    restaurant.city = data.city || restaurant.city;
    restaurant.state = data.state || restaurant.state;
    restaurant.zipCode = data.zipCode || restaurant.zipCode;
    restaurant.coordinates = data.coordinates || restaurant.coordinates;

    // Save the updated Restaurant document
    await restaurant.save();

    return restaurant;
};


// 
const updateOpeningHours = async (id, data) => {
    const { openingHours } = data;
    // Find the Restaurant associated with the Admin ID
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    // Update the Restaurant's openingHours
    restaurant.openingHours = openingHours;

    // Save the updated Restaurant document
    await restaurant.save();

    return restaurant;
};


// Additional Restaurant-specific functions can be added here... 
export {
    createRestaurant,
    getAllRestaurants,
    getAllActiveRestaurants,
    getRestaurantById,
    updateRestaurantById,
    softDeleteRestaurantById,
    restaurantLogin,
    restaurantLogout,
    restaurantChangePassword,
    changePassword,
    updateAddress,
    updateOpeningHours
};
