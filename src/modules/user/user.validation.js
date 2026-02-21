import joi from "joi";
import { GenderEnum } from "../../common/enums/user.enum.js";


export const signUpSchema = {
    body: joi.object({
        fullName: joi.string().alphanum().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().valid(joi.ref("password")).required(),
        gender: joi.string().valid(...Object.values(GenderEnum)).required(),
        age: joi.number().positive().integer(),
        phone: joi.string().required(),
    }).required()
}


export const signInSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    }).required(),
    query: joi.object({
        // x: joi.string().required(),
    }).required()
}