import { Router } from "express";
import bannerRouter from "./banner.routes.js"; // Ensure the correct path and file extension

const router = Router();

// Mount the userRouter at /users
router.use("/", bannerRouter);

export default router;
