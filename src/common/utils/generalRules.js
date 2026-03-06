
import joi from "joi"
import { Types } from "mongoose"

export const general_rules = {
    email: joi.string().email({ tlds: { allow: true }, minDomainSegments: 2, maxDomainSegments: 2 }),
    password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    confirmPassword: joi.string().valid(joi.ref("password")),
    id: joi.string().custom((value, helpers) => {
        const isValid=Types.ObjectId.isValid(value);
        return isValid ? value : helpers.message("invalid id"); 
    }),
    file: joi.object({
        feildname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
    }).messages({
        "any.required": "file is required",
    }),
}