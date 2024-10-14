import { Router } from "express";
import * as PrivacyPolicyController from "../../controllers/admin/privacy.policy.controller.js"; // Ensure the path is correct
import * as privacyPolicyValidation from '../../validations/privacy.policy.validation.js'; // Validation rules
import validate from "../../middlewares/validate.js"; // Validation middleware
import { verifyJWT } from "../../middlewares/admin.auth.middleware.js"; // Ensure the path is correct

const router = Router();

// Route to fetch all terms and conditions
router.get("/privacy_policy", verifyJWT, PrivacyPolicyController.privacyList);

// Route to fetch a single term and condition by ID
router.get(
    "/privacy_policy/:id",
    verifyJWT,
    validate(privacyPolicyValidation.getPrivacyPolicyById),
    PrivacyPolicyController.getPrivacyById
);

// Route to create a new term and condition
router.post(
    "/privacy_policy",
    verifyJWT,
    validate(privacyPolicyValidation.addNewPrivacyPolicy),
    PrivacyPolicyController.addNewPrivacy
);

// Route to update an existing term and condition
router.put(
    "/privacy_policy/:id",
    verifyJWT,
    validate(privacyPolicyValidation.updatePrivacyPolicy),
    PrivacyPolicyController.updatePrivacy
);

// Route to change the status of an existing term and condition
router.put(
    "/privacy_policy/change_status/:id",
    verifyJWT,
    validate(privacyPolicyValidation.changeStatus),
    PrivacyPolicyController.changeStatus
);

// Route to delete a term and condition by ID
router.delete(
    "/privacy_policy/:id",
    verifyJWT,
    validate(privacyPolicyValidation.deletePrivacyPolicy),
    PrivacyPolicyController.deletePrivacy
);

export default router;
