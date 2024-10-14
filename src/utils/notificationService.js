import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const sendNotification = async (tokens, notification, data) => {
  const fcmServerKey = process.env.FCM_SERVER_KEY;

  const notificationData = {
    registration_ids: tokens,
    notification: notification,
    data: data
  };
  try {
    const response = await axios.post('https://fcm.googleapis.com/fcm/send', notificationData, {
      headers: {
        Authorization: `key=${fcmServerKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Notification sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error.response ? error.response.data : error.message);
    throw error;
  }
};

