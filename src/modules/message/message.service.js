import * as db_services from "../../DB/db_service.js";
import userModel from "../../DB/models/user.model.js";
import messageModel from "../../DB/models/message.model.js";
import { successResponse } from "../../common/utils/response.success.js";
import cloudinary from "../../common/utils/cloudinary.js";
export const sendMessage = async (req, res, next) => {
    try {
        const { content, userId } = req.body;
        const user = await db_services.findById({
            model: userModel,
            id: userId
        });
        if (!user) {
            throw new Error("user not found..🤷", { cause: 400 })
        }
        let arr_paths = [];
        if (req.files?.attachements?.length) {
            for (const file of req.files.attachements) {
                const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, {
                    folder: "Saraha_App/messages",
                });
                arr_paths.push({
                    public_id,
                    secure_url
                })
            }
        }

        const message = await db_services.create({
            model: messageModel,
            data: {
                content,
                userId: user._id,
                attachements: arr_paths,
            }
        });
        successResponse({ res, data: message })
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getMessage=async (req,res,next)=>{
    try {
       const {messageId}=req.params;
        const message=await db_services.findById({
            model:messageModel,
            id:messageId
        });
        if(!message){
            throw new Error("message not found..", { cause: 400 })
        }
        successResponse({ res, data: message })

    } catch (error) {
        throw new Error(error.message)
    }
}

export const getAllMessages=async (req,res,next)=>{
    try {
        const messages=await db_services.find({
            model:messageModel,
        });
        successResponse({ res ,metaData:`messages count: ${messages.length}` ,data: messages}) 
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getMessages=async (req,res,next)=>{
    try {
        const messages=await db_services.find({
            model:messageModel,
            filter:{userId:req.params.userId}
        });
        successResponse({ res ,metaData:`messages count: ${messages.length}` ,data: messages}) 
    } catch (error) {
        throw new Error(error.message)
    }
}