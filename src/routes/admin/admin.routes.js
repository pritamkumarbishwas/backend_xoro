import { Router } from "express";
import * as AdminController from "../../controllers/admin/admin.controller.js"; // Ensure the path is correct
import { upload } from "../../middlewares/multer.middleware.js";
import * as adminValidation from '../../validations/admin.validation.js';
import validate from "../../middlewares/validate.js";
import { verifyJWT } from "../../middlewares/admin.auth.middleware.js"; // Ensure the path is correct

const router = Router();
// Route for changing admin password
router.put("/change_password", verifyJWT, validate(adminValidation.changePassword), AdminController.changeAdminPassword);

// Route to fetch all admins
router.get("/", verifyJWT, AdminController.getAllAdmins);

// Route to fetch a single admin by ID
router.get("/:id", verifyJWT, validate(adminValidation.getAdminById), AdminController.getAdminById);

// Route to create a new admin (POST)
router.post("/", verifyJWT, upload.single("image"), AdminController.createAdmin);

// Route to update an existing admin (PUT)
router.put("/:id", verifyJWT, upload.single("image"), AdminController.updateAdminById);

// Route to soft delete an admin by ID (DELETE)
router.delete("/:id", verifyJWT, validate(adminValidation.softDeleteAdminById), AdminController.softDeleteAdminById);

// Route for admin login
router.post("/login", validate(adminValidation.adminLogin), AdminController.adminLogin);

// Route for admin logout
router.post("/logout", verifyJWT, AdminController.adminLogout);


export default router;
