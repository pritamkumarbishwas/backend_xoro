import { Banners } from '../models/banner.model.js';

// Function to create a new banner
const createBanner = async (data) => {
    const newBanner = new Banners(data);
    return await newBanner.save();

};

// Function to fetch all active banners (excluding deleted)
const getAllBanners = async () => {
    return await Banners.find(); // Middleware filters deleted banners
};

// Function to fetch all active banners (excluding deleted or Blocked)
const getAllActiveBanners = async () => {
    return await Banners.find({ status: "Active" }); // Middleware filters deleted banners
};

// Function to fetch a banner by ID (excluding deleted)
const getBannerById = async (id) => {
    return await Banners.findById(id); // Middleware filters deleted banners

};

// Function to update a banner by ID
const updateBannerById = async (id, updateData) => {
    return await Banners.findByIdAndUpdate(id, updateData, { new: true }); // Returns the updated document
};


// Function to soft delete a banner
const softDeleteBannerById = async (id) => {
    return await Banners.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};


export { createBanner, getAllBanners, getAllActiveBanners, getBannerById, updateBannerById, softDeleteBannerById };