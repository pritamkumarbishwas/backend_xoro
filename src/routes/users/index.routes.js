import { Router } from "express";
import userRouter from "./user.routes.js";
import commonRoute from './common.routes.js';
import productRoute from './product.routes.js';

const router = Router();

// Mount the userRouter at /users
router.use("/", userRouter);
router.use("/", commonRoute);
router.use("/", productRoute);

export default router;
