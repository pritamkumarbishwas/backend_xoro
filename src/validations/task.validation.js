import Joi from 'joi';

const createTask = {
    body: Joi.object().keys({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500).optional(),
        status: Joi.string().valid('Pending', 'In Progress', 'Completed').required(),
    }),
};

const getTaskById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
};

const updateTaskById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
    body: Joi.object().keys({
        title: Joi.string().min(3).max(100).optional(),
        description: Joi.string().max(500).optional(),
        status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional(),
    }),
};

const deleteTaskById = {
    params: Joi.object().keys({
        id: Joi.string().hex().length(24).required(),
    }),
};

export {
    createTask,
    getTaskById,
    updateTaskById,
    deleteTaskById,
};
