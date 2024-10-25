import * as TaskService from '../services/task.service.js'; 
import { ApiError } from "../utils/ApiError.js";
import httpStatus from 'http-status';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from "../utils/asyncHandler.js";

// Creating a new Task
const createTask = asyncHandler(async (req, res) => {
    const newTask = await TaskService.createTask(req.body);

    if (!newTask) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create Task.");
    }

    return res.status(httpStatus.CREATED).json(
        new ApiResponse(httpStatus.CREATED, newTask, "Task created successfully")
    );
});

// Fetching all Tasks
const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await TaskService.getAllTasks();

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, tasks, "Tasks fetched successfully")
    );
});

// Fetching a single Task by ID
const getTaskById = asyncHandler(async (req, res) => {
    const task = await TaskService.getTaskById(req.params.id);

    if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, task, "Task fetched successfully")
    );
});

// Updating a Task by ID
const updateTaskById = asyncHandler(async (req, res) => {
    const updatedTask = await TaskService.updateTaskById(req.params.id, req.body);

    if (!updatedTask) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found.");
    }

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedTask, "Task updated successfully")
    );
});

// Permanently deleting a Task by ID
const deleteTaskById = asyncHandler(async (req, res) => {
    const result = await TaskService.deleteTaskById(req.params.id);

    return res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, {}, "Task deleted successfully")
    );
});

export {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById, 
};
