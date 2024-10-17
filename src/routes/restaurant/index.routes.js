
import { Router } from "express";
import restaurantRouter from "./restaurant.routes.js";
import productRouter from "./product.routes.js";
import notificationRoute from "./notification.routes.js";
import userNotificationRoute from "./user.notification.routes.js";
import couponRoute from "./coupon.routes.js";

const router = Router();

// Mount the userRouter at /users
router.use("/", productRouter);
router.use("/", notificationRoute);
router.use("/", notificationRoute);
router.use("/", userNotificationRoute);
router.use("/", couponRoute);
router.use("/", restaurantRouter);

export default router;
