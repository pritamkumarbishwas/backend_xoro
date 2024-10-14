import Joi from "joi";
import { objectId } from "./custom.validation.js";

const getTermConditionById = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
};

const addNewTermCondition = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        status: Joi.string().valid("Active", "Block").optional(),
        page: Joi.string().valid("Admin", "User").optional(),
        description: Joi.string().required(),
    }),
};

const updateTermCondition = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
        status: Joi.string().valid("Active", "Block").required(),
        page: Joi.string().valid("Admin", "User").optional(),
        description: Joi.string().required(),
    }),
};

const changeStatus = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
        status: Joi.string().valid("Active", "Block").required(),
    }),
};

const deleteTermCondition = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
    }),
};

export {
    getTermConditionById,
    addNewTermCondition,
    updateTermCondition,
    changeStatus,
    deleteTermCondition
};
