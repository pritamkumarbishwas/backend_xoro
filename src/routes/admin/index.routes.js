import { Router } from "express";
import bannerRouter from "./banner.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";
import adminRouter from "./admin.routes.js";
import tagsRouter from "./tag.routes.js";

const router = Router();

// Mount the userRouter at /users
router.use("/", bannerRouter);
router.use("/", categoryRouter);
router.use("/", productRouter);
router.use("/", tagsRouter);
router.use("/", adminRouter);

export default router;
