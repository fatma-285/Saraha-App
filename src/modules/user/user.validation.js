import joi from "joi";
import { GenderEnum } from "../../common/enums/user.enum.js";
import { general_rules } from "../../common/utils/generalRules.js";

export const signUpSchema = {
    body: joi.object({
        fullName: joi.string().alphanum().trim().min(3).max(30).required(),
        email: general_rules.email.required(),
        password: general_rules.password.required(),
        confirmPassword: general_rules.confirmPassword.required(),
        gender: joi.string().valid(...Object.values(GenderEnum)).required(),
        age: joi.number().positive().integer(),
        phone: joi.string().required(),
    }).required(),

    //single

    // file: general_rules.file.required().messages({
    //     "any.required": "profile picture is required",
    // }),

    //array

    // files:joi.array().items(general_rules.file.required()).required().messages({
    //     "any.required": "cover picture is required",
    // })

    //feilds
    
    // files: joi.object({
    //     profilePicture: joi.array().max(1).items(general_rules.file.required().messages({
    //             "any.required": "profile picture is required",
    //         }),
    //     ).required(),
    //     coverPictures: joi.array().max(5).items(general_rules.file.required()).required().messages({
    //             "any.required": "cover picture is required",
    //         })
    //     .required()
// })
}


export const signInSchema = {
    body: joi.object({
        email: general_rules.email.required(),
        password:general_rules.password.required(),
    }).required(),
    query: joi.object({
        // x: joi.string().required(),
    }).required()
}

export const shareProfileSchema = {
    params:joi.object({
        id:general_rules.id.required()
    })
}

export const updateProfileSchema = {
    body: joi.object({
        firstName: joi.string().trim().min(3).max(30).required(),
        lastName: joi.string().trim().min(3).max(30).required(),
        gender: joi.string().valid(...Object.values(GenderEnum)).required(),
        age: joi.number().positive().integer(),
        phone: joi.string().required(),
    }).required(),
}

export const updatePasswordSchema={
    body:joi.object({
        oldPassword:general_rules.password.required(),
        newPassword:general_rules.password.required(),
        confirmPassword:joi.string().valid(joi.ref("newPassword")).required(),
    }).required()
}

export const updateProfilePictureSchema = {
    file: general_rules.file.required().messages({
        "any.required": "profile picture is required",
    }),
}

export const updateCoverPictureSchema = {
    file: general_rules.file.required().messages({
        "any.required": "cover picture is required",
    }),
}

export const confirmEmailSchema={
    body:joi.object({
        email:general_rules.email.required(),
        otp:joi.string().required(),
    }).required()
}