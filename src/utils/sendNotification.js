import { messaging } from "../config/firebase.js";

export const sendNotification = async ({ token, data }) => {
    try {
        const message = {
            data: data,
            token: token,
            android: { priority: 'high' }
        };

        const response = await messaging.send(message);
        console.log(response)
    } catch (error) {
        console.log(error);
    }
};
