import { Router } from "express";
import bannerRouter from "./banner.routes.js"; 
import categoryRouter from "./category.routes.js"; 
import productRouter from "./product.routes.js"; 

const router = Router();

// Mount the userRouter at /users
router.use("/", bannerRouter);
router.use("/", categoryRouter);
router.use("/", productRouter);

export default router;
