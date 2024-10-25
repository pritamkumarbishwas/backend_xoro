import {Task} from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import httpStatus from "http-status";

// Function to create a new Task
const createTask = async (data) => {
    const { title, description, status } = data;

    const existingTask = await Task.findOne({ title });

    if (existingTask) {
        throw new ApiError(httpStatus.CONFLICT, "Task already exists.");
    }

    // Prepare Task data
    const taskData = {
        title,
        description,
        status,
    };

    const newTask = new Task(taskData);

    return await newTask.save();
};

// Function to fetch all tasks
const getAllTasks = async () => {
    return await Task.find().sort({ createdAt: -1 }); 
};


// Function to fetch a Task by ID
const getTaskById = async (id) => {
    const task = await Task.findById(id); 
    if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found.");
    }
    return task;
};

// Function to update a Task by ID
const updateTaskById = async (id, data) => {
    const { title, description, status } = data;

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedTask) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found.");
    }

    return updatedTask;
};

// Function to permanently delete a Task by ID
const deleteTaskById = async (id) => {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found.");
    }

    return { message: "Task successfully deleted." };
};



export {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById,
};
