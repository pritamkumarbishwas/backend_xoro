
import { Router } from "express";
import restaurantRouter from "./restaurant.routes.js";
import productRouter from "./product.routes.js";

const router = Router();

// Mount the userRouter at /users
router.use("/", productRouter);
router.use("/", restaurantRouter);

export default router;
