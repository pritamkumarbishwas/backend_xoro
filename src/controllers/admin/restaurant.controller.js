import * as RestaurantService from '../../services/admin/restaurant.service.js';
import { ApiError } from "../../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

// Create a new Restaurant
const createRestaurant = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const imageLocalPath = req.files?.image[0]?.path;
    if (!imageLocalPath) {
        throw new ApiError(400, "Image file is required")
    }



    // Create the Restaurant with form data and image
    const result = await RestaurantService.createRestaurant(req, avatarLocalPath, imageLocalPath);


    return res.status(httpStatus.CREATED).json(
        new ApiResponse(httpStatus.CREATED, result, "Restaurant created successfully")
    );
});

// Fetch all active Restaurants
const getAllRestaurants = asyncHandler(async (req, res) => {
    const Restaurants = await RestaurantService.getAllRestaurants();

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, Restaurants, "Restaurants fetched successfully")
    );
});

// Fetch a single Restaurant by ID
const getRestaurantById = asyncHandler(async (req, res) => {
    const Restaurant = await RestaurantService.getRestaurantById(req.params.id);

    if (!Restaurant) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, Restaurant, "Restaurant fetched successfully")
    );
});

// Update an Restaurant by ID
const updateRestaurantById = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path; // Get the path of the uploaded file (if any)

    // Merge the update data, including the image if provided
    const updatedRestaurant = await RestaurantService.updateRestaurantById(req.params.id, {
        ...req.body,
        avatar: avatarLocalPath || req.body.avatar // Update avatar if a new image is provided
    });

    if (!updatedRestaurant) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedRestaurant, "Restaurant updated successfully")
    );
});

// Soft delete an Restaurant by ID (logical deletion)
const softDeleteRestaurantById = asyncHandler(async (req, res) => {
    const deletedRestaurant = await RestaurantService.softDeleteRestaurantById(req.params.id);

    if (!deletedRestaurant) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, deletedRestaurant, "Restaurant deleted successfully")
    );
});


// Restaurant login - generates OTP
const restaurantLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Generate OTP and get user info
    const response = await RestaurantService.restaurantLogin(email, password);

    // Send OTP response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, response, "Login successfully")
    );

});

// Restaurant logout - invalidates refresh token
const restaurantLogout = asyncHandler(async (req, res) => {
    const adminId = req.admin.id; // Assuming `req.user` contains the authenticated Restaurant's ID

    // Call the RestaurantLogout service function
    const response = await RestaurantService.restaurantLogout(adminId);

    // Send the response back to the client
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, {}, "Logout successful")
    );
});

// Restaurant password change 
const changePassword = asyncHandler(async (req, res) => {
    const adminId = req.admin.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
        return res.status(httpStatus.BAD_REQUEST).json(
            new ApiResponse(httpStatus.BAD_REQUEST, null, 'Current and new password are required')
        );
    }

    // Call the changePassword function
    const response = await RestaurantService.changePassword(adminId, currentPassword, newPassword);

    // Send success response
    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, response, 'Password changed successfully')
    );
});

const updateAddress = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;

    const updatedAddress = await RestaurantService.updateAddress(restaurantId, req.body);
    if (!updatedAddress) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedAddress, "Restaurant Address updated successfully")
    );

});


// 
const updateOpeningHours = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;

    const updatedAddress = await RestaurantService.updateOpeningHours(restaurantId, req.body);
    if (!updatedAddress) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedAddress, "Restaurant Address updated successfully")
    );

});

export {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurantById,
    softDeleteRestaurantById,
    restaurantLogin,
    restaurantLogout,
    changePassword,
    updateAddress,
    updateOpeningHours
};
