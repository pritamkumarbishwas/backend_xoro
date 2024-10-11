import { Router } from "express";
import bannerRouter from "./banner.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";
import adminRouter from "./admin.routes.js";
import tagsRouter from "./tag.routes.js";
import restaurantRouter from "../admin/restaurant.routes.js";
import notificationRoute from "../admin/notification.routes.js";
const router = Router();

// Mount the admin
router.use("/", bannerRouter);
router.use("/", categoryRouter);
router.use("/", productRouter);
router.use("/", tagsRouter);
router.use("/", restaurantRouter);
router.use("/", notificationRoute);
router.use("/", adminRouter);

export default router;
