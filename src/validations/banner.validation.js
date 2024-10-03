import Joi from 'joi';



// Validation schema for fetching a banner by ID
const getBannerById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
};

// Validation schema for updating a banner by ID
const updateBannerById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    })
};

// Validation schema for soft deleting a banner by ID
const softDeleteBannerById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
};

export {
    getBannerById,
    updateBannerById,
    softDeleteBannerById,
};
