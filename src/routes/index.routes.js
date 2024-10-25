import { Router } from "express";
import taskRouter from "./task.routes.js";

const router = Router();

router.use("/", taskRouter);

export default router;
