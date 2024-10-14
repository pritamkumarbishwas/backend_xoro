import { Router } from "express";
import * as TermsConditionController from "../../controllers/admin/term.condition.controller.js"; // Ensure the path is correct
import * as termsConditionValidation from '../../validations/term.condition.validation.js'; // Validation rules
import validate from "../../middlewares/validate.js"; // Validation middleware
import { verifyJWT } from "../../middlewares/admin.auth.middleware.js"; // Ensure the path is correct

const router = Router();

// Route to fetch all terms and conditions
router.get("/term_condition", verifyJWT, TermsConditionController.termList);

// Route to fetch a single term and condition by ID
router.get(
    "/term_condition/:id",
    verifyJWT,
    validate(termsConditionValidation.getTermConditionById),
    TermsConditionController.getTermById
);

// Route to create a new term and condition
router.post(
    "/term_condition",
    verifyJWT,
    validate(termsConditionValidation.addNewTermCondition),
    TermsConditionController.addNewTerm
);

// Route to update an existing term and condition
router.put(
    "/term_condition/:id",
    verifyJWT,
    validate(termsConditionValidation.updateTermCondition),
    TermsConditionController.updateTerm
);

// Route to change the status of an existing term and condition
router.put(
    "/term_condition/change_status/:id",
    verifyJWT,
    validate(termsConditionValidation.changeStatus),
    TermsConditionController.changeStatus
);

// Route to delete a term and condition by ID
router.delete(
    "/term_condition/:id",
    verifyJWT,
    validate(termsConditionValidation.deleteTermCondition),
    TermsConditionController.deleteTerm
);

export default router;
