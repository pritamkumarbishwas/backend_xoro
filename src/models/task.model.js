import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const TaskStatus = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
};

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true, 
            index: true,
        },
        description: {
            type: String,
            trim: true, 
        },
        status: {
            type: String,
            enum: Object.values(TaskStatus), 
            required: true,
        },
    },
    {
        collection: 'tasks', 
        timestamps: true, 
    }
);

const Task = model('Task', taskSchema);

export { Task, TaskStatus }; 
