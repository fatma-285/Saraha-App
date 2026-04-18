import Joi from "joi";
import { general_rules } from "../../common/utils/generalRules.js";

export const sendMessageSchema={
    body:Joi.object({
        content:Joi.string().required(),
        userId:general_rules.id.required(),
    }).required(),
    files: Joi.object({
    attachements: Joi.array().items(
        Joi.object({
            fieldname: Joi.string(),
            originalname: Joi.string(),
            encoding: Joi.string(),
            mimetype: Joi.string(),
            destination: Joi.string(),
            filename: Joi.string(),
            path: Joi.string(),
            size: Joi.number()
        })
    )
})
}
export const getMessageSchema={
    params:Joi.object({
        messageId:general_rules.id.required(),
    }).required()
}
