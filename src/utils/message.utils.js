import axios from 'axios'; // Make sure to install axios
import { ApiError } from './ApiError.js'; // Error handling utility
import httpStatus from 'http-status';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configuration for your SMS provider
const SMS_API_URL = process.env.SMS_API_URL;
const SMS_API_KEY = process.env.SMS_API_KEY;

// Configuration for your WhatsApp provider
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;

/**
 * Function to send an SMS.
 * @param {string} phone - The phone number to send the SMS to.
 * @param {string} message - The message to send.
 * @returns {Promise<void>} - A promise that resolves when the SMS is sent.
 */
export const sendSMS = async (phone, message) => {
    try {
        const response = await axios.post(SMS_API_URL, {
            to: phone,
            message: message,
        }, {
            headers: {
                'Authorization': `Bearer ${SMS_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send SMS');
        }
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `SMS sending failed: ${error.message}`);
    }
};

/**
 * Function to send a WhatsApp message.
 * @param {string} phone - The phone number to send the message to.
 * @param {string} message - The message to send.
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
 */

export const sendWhatsAppMessage = async (phone, message) => {
    try {
        const response = await axios.post(WHATSAPP_API_URL, {
            to: phone,
            message: message,
        }, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send WhatsApp message');
        }
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `WhatsApp sending failed: ${error.message}`);
    }
};
