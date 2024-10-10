import { Router } from "express";
import * as RestaurantController from "../../controllers/restaurant/restaurant.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import * as restaurantValidation from '../../validations/restaurant.validation.js';
import validate from "../../middlewares/validate.js";
import { verifyJWT } from "../../middlewares/admin.auth.middleware.js";

const router = Router();

// Route to fetch a single restaurant by ID
router.get("/:id", validate(restaurantValidation.getById), RestaurantController.getRestaurantById);

// Route to update an existing restaurant (PUT)
router.put("/:id", upload.single("image"), RestaurantController.updateAddress);

// Route for restaurant login
router.post("/login", validate(restaurantValidation.restaurantLogin), RestaurantController.restaurantLogin);

// Route for restaurant logout
router.post("/logout", verifyJWT, RestaurantController.restaurantLogout);

// Route for changing restaurant password
router.put("/change_password", verifyJWT, validate(restaurantValidation.changePassword), RestaurantController.changePassword);


export default router;
