import { Router } from "express";
import bannerRouter from "./banner.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";
import tagsRouter from "./tag.routes.js";
import restaurantRouter from "../admin/restaurant.routes.js";
import notificationRoute from "../admin/notification.routes.js";
import termConditionRoute from "../admin/term.condition.routes.js";
import privacyPolicyRoute from "../admin/privacy.policy.routes.js";
import giftCardCategoryRoute from "../admin/gift.card.category.routes.js";
import giftCard from "../admin/gift.card.routes.js";
import adminRouter from "./admin.routes.js";
import couponRoute from "./coupon.routes.js";
import voucherRoute from "./voucher.routes.js";
const router = Router();

// Mount the admin
router.use("/", bannerRouter);
router.use("/", categoryRouter);
router.use("/", productRouter);
router.use("/", tagsRouter);
router.use("/", restaurantRouter);
router.use("/", notificationRoute);
router.use("/", termConditionRoute);
router.use("/", privacyPolicyRoute);
router.use("/", giftCardCategoryRoute);
router.use("/", giftCard);
router.use("/", couponRoute);
router.use("/", voucherRoute);
router.use("/", adminRouter);

export default router;
