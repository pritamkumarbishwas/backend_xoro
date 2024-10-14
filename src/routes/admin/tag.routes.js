import { Router } from "express";
import * as TagController from "../../controllers/admin/tags.controller.js"; // Ensure the path is correct
import * as tagValidation from '../../validations/tag.validation.js'; // Validation rules
import validate from "../../middlewares/validate.js"; // Validation middleware
import { verifyJWT } from "../../middlewares/admin.auth.middleware.js"; // Ensure the path is correct

const router = Router();

// Route to fetch all tags
router.get("/tags",verifyJWT, TagController.getAllTags);

// Route to fetch a single tag by ID
router.get("/tags/:id",verifyJWT, validate(tagValidation.getTagById), TagController.getTagById);

// Route to create a new tag (POST)
router.post("/tags",verifyJWT, validate(tagValidation.createTag), TagController.createTag);

// Route to update an existing tag (PUT)
router.put("/tags/:id",verifyJWT, validate(tagValidation.updateTagById), TagController.updateTagById);

// Route to soft delete a tag by ID (DELETE)
router.delete("/tags/:id",verifyJWT, validate(tagValidation.softDeleteTagById), TagController.softDeleteTagById);

export default router;
