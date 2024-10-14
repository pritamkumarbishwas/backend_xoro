import Queue from 'bull';
import { sendSMS, sendWhatsAppMessage } from './message.utils.js';
import { sendNotification } from './notificationService.js';

const messageQueue = new Queue('messageQueue');

// Process messages based on their type
messageQueue.process(async (job) => {
    const { type, phone, message, fcmToken } = job.data;

    try {
        switch (type) {
            case 'sms':
                await sendSMS(phone, message);
                console.log(`SMS sent to ${phone}`);
                break;

            case 'whatsapp':
                await sendWhatsAppMessage(phone, message);
                console.log(`WhatsApp message sent to ${phone}`);
                break;

            case 'fcm':
                await sendNotification(fcmToken, message); // Assuming you have this function
                console.log(`FCM notification sent to ${fcmToken}`);
                break;

            default:
                console.error(`Unknown message type: ${type}`);
                break;
        }
    } catch (error) {
        console.error(`Failed to process ${type} message: ${error.message}`);
        throw error; // Rethrow error to trigger retries if necessary
    }
});

// Function to queue a normal SMS
export const queueSMS = (phone, message) => {
    messageQueue.add({ type: 'sms', phone, message }, {
        attempts: 3,
        backoff: 5000,
        priority: 1, // Higher priority
    });
};

// Function to queue a WhatsApp message
export const queueWhatsAppMessage = (phone, message) => {
    messageQueue.add({ type: 'whatsapp', phone, message }, {
        attempts: 3,
        backoff: 5000,
        priority: 2, // Lower priority than SMS
    });
};

// Function to queue a normal notification
export const queueFCMNotification = (fcmToken, message) => {
    messageQueue.add({ type: 'fcm', fcmToken, message }, {
        attempts: 3,
        backoff: 5000,
        priority: 3, // Lowest priority
    });
};
