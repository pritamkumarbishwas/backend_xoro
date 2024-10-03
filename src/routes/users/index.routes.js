import { Router } from "express";
import userRouter from "./user.routes.js"; // Ensure the correct path and file extension
import commonRoute from './common.routes.js';

const router = Router();

// Mount the userRouter at /users
router.use("/", userRouter);
router.use("/", commonRoute);

export default router;
