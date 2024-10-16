import { Router } from "express";
import { verifyJWT } from "../../middlewares/users.auth.middleware.js";
import * as transactionController from "../../controllers/users/transaction.controller.js"; 
import * as transactionValidation from '../../validations/users.transaction.validation.js';
import validate from "../../middlewares/validate.js";

const router = Router();

// Route to get all transactions for the authenticated user
router.route("/transactions").get(verifyJWT, transactionController.getUserTransactions);

// Route to create a new transaction
router.route("/transactions").post(verifyJWT, validate(transactionValidation.createTransaction), transactionController.createTransaction);

// Route to get a specific transaction by ID
router.route("/transactions/:id").get(verifyJWT,validate(transactionValidation.getTransactionById), transactionController.getTransactionById);

// You can add more routes below as needed

export default router;
