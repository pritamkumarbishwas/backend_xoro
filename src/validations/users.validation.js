import Joi from 'joi';

// Import custom validation functions if needed
import { objectId, customJoi } from './custom.validation.js';

const userLogin = {
    body: Joi.object().keys({
        mobileNo: Joi.number()
            .required()
            .messages({
                'string.base': 'Mobile number must be a string',
                'string.empty': 'Mobile number is required',
                'any.required': 'Mobile number is required',
            }),
    }),
};

const verifyOtp = {
    body: Joi.object().keys({
        mobileNo: Joi.string()
            .required()
            .messages({
                'string.base': 'Mobile number must be a string',
                'string.empty': 'Mobile number is required',
                'any.required': 'Mobile number is required',
            }),
        fcmToken: Joi.string()
            .required()
            .messages({
                'string.base': 'FCM Token must be a string',
                'string.empty': 'FCM Token is required',
                'any.required': 'FCM Token is required',
            }),
        otp: Joi.number()
            .required()
            .messages({
                'string.base': 'OTP must be a string',
                'string.empty': 'OTP is required',
                'any.required': 'OTP is required',
            }),
    }),
};


const updateProfile = {
    body: Joi.object().keys({
        firstName: Joi.string()
            .required()
            .messages({
                'string.base': 'First name must be a string',
                'string.empty': 'First name is required',
                'any.required': 'First name is required',
            }),
        lastName: Joi.string()
            .required()
            .messages({
                'string.base': 'Last name must be a string',
                'string.empty': 'Last name is required',
                'any.required': 'Last name is required',
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.base': 'Email must be a string',
                'string.email': 'Email must be a valid email',
                'string.empty': 'Email is required',
                'any.required': 'Email is required',
            }),
        gender: Joi.string()
            .valid('Male', 'Female', 'Other')
            .required()
            .messages({
                'string.base': 'Gender must be a string',
                'any.only': 'Gender must be one of the following: Male, Female, Genderfluid, Non-binary, Bigender, Polygender, Genderqueer, Agender',
                'string.empty': 'Gender is required',
                'any.required': 'Gender is required',
            }),
    }),
};



export {
    userLogin,
    verifyOtp,
    updateProfile
};
