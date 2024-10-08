import { Router } from "express";
import * as RestaurantController from "../../controllers/admin/restaurant.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import * as restaurantValidation from '../../validations/admin.validation.js';
import validate from "../../middlewares/validate.js";
import { verifyJWT } from "../../middlewares/admin.auth.middleware.js";

const router = Router();

// Route for changing restaurant password
router.put("/restaurants/change_password", verifyJWT, validate(restaurantValidation.changePassword), RestaurantController.changePassword);

// Route to fetch all restaurants
router.get("/restaurants", RestaurantController.getAllRestaurants);

// Route to fetch a single restaurant by ID
router.get("/restaurants/:id", validate(restaurantValidation.getAdminById), RestaurantController.getRestaurantById);

// Route to create a new restaurant (POST)
router.post("/restaurants", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "image",
        maxCount: 1
    }
]), RestaurantController.createRestaurant);


// Route to update an existing restaurant (PUT)
router.put("/restaurants/:id", upload.single("image"), RestaurantController.updateRestaurantById);

// Route to soft delete a restaurant by ID (DELETE)
router.delete("/restaurants/:id", validate(restaurantValidation.softDeleteRestaurantById), RestaurantController.softDeleteRestaurantById);

// Route for restaurant login
router.post("/restaurants/login", validate(restaurantValidation.restaurantLogin), RestaurantController.restaurantLogin);

// Route for restaurant logout
router.post("/restaurants/logout", verifyJWT, RestaurantController.restaurantLogout);

// Route for address update
router.put("/restaurants/:id/address", RestaurantController.updateAddress);

// Route for updating opening hours (changed to PUT for updates)
router.put("/restaurants/:id/opening_hours", verifyJWT, RestaurantController.updateOpeningHours);

export default router;
