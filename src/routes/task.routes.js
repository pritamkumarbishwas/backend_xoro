import { Router } from "express";
import * as TaskController from "../controllers/task.controller.js"; 
import * as taskValidation from '../validations/task.validation.js'; 
import validate from "../middlewares/validate.js";

const router = Router();

// Route to fetch all tasks
router.get("/tasks",  TaskController.getAllTasks);

// Route to fetch a single task by ID
router.get("/tasks/:id",  validate(taskValidation.getTaskById), TaskController.getTaskById);

// Route to create a new task (POST)
router.post("/tasks",  validate(taskValidation.createTask), TaskController.createTask);

// Route to update an existing task (PUT)
router.put("/tasks/:id",  validate(taskValidation.updateTaskById), TaskController.updateTaskById);

// Route to permanently delete a task by ID (DELETE)
router.delete("/tasks/:id",  validate(taskValidation.deleteTaskById), TaskController.deleteTaskById);

export default router;
