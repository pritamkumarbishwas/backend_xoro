import { Router } from "express";
import userRouter from "./user.routes.js";
import commonRoute from './common.routes.js';
import productRoute from './product.routes.js';
import transactionRoute from './user.wallet.transaction.routes.js';
import giftCardRoute from './gift.card.routes.js';
import couponRoute from './coupon.routes.js';
import voucherRoute from './voucher.routes.js';

const router = Router();

// Mount the userRouter at /users
router.use("/", userRouter);
router.use("/", commonRoute);
router.use("/", productRoute);
router.use("/", transactionRoute);
router.use("/", giftCardRoute);
router.use("/", couponRoute);
router.use("/", voucherRoute);

export default router;
