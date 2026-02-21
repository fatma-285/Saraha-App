import { ProviderEnum } from "../../common/enums/user.enum.js";
import userModel from "../../DB/models/user.model.js";
import * as db_services from "../../DB/db_services.js";
import { successResponse } from "../../common/utils/response.success.js";
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import { generateToken } from "../../common/utils/security/token.service.js";
import {OAuth2Client} from 'google-auth-library';
import { SECRET_KEY } from "../../../config/config.service.js";



export const signUp = async (req, res, next) => {
    try {
        const { fullName, email, password, confirmPassword, gender, age, phone } = req.body;
        if(!fullName||!email||!password||!confirmPassword||!gender||!age||!phone){
            throw new Error("all fields are required..",{cause:400})
        }
        if (await db_services.findOne({ model: userModel, filter: { email } })) {
            throw new Error("user already exist..🤷‍♀️",{cause:400})
        }
        if (password !== confirmPassword) {
            throw new Error("passwords do not match..",{cause:400})
        }
        const user = await db_services.create({ model: userModel, data: { fullName, email, password:Hash({cipherText:password}), gender, age, phone:encrypt(phone) } });
        successResponse({res,status:201,message:"user created successfully..👌",data:user})
    } catch (error) {
        throw new Error(error.message)
    }
}

export const signUpWithGmail = async (req, res, next) => {
    try {
        const { idToken} = req.body;
        console.log({idToken});
const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
      idToken,
      audience: "434943204420-roidgnlijsdckhkud1p5961umadcj412.apps.googleusercontent.com", 
  });
  const payload = ticket.getPayload();
console.log(payload);
   const {email,name,picture,email_verified}=payload;
   let user=await db_services.findOne({model:userModel,filter:{email}});
   if(!user){
    //register
    user=await db_services.create({model:userModel,data:{
        email,
        fullName:name,
        profilePicture:picture,
        confirmed:email_verified,
        provider:ProviderEnum.google
    }});
   }
   //login
   if(user.provider!==ProviderEnum.google){
    throw new Error("provider is not google",{cause:400})
   }
       const access_token =generateToken({
            payload:{id:user._id,email:user.email,role:user.role},
            secret_key:SECRET_KEY,
            options:{            
            expiresIn:"1d",
        }
    });
successResponse({res,message:"user logged in successfully..👌",data:{access_token}})
    } catch (error) {
        throw new Error(error.message)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("all fields are required..",{cause:400})
        }
        const user = await db_services.findOne({ model: userModel, filter: { email, provider: ProviderEnum.system } });
        if (!user) {
            throw new Error("user not found..🤷",{cause:400})
        }
        const match=Compare({plainText:password,cipherText:user.password});
        if (!match) {
            throw new Error("wrong password..",{cause:400})
        }
        const access_token =generateToken({
            payload:{id:user._id,email:user.email,role:user.role},
            secret_key:SECRET_KEY,
            options:{            
            expiresIn:"1d",
            // noTimestamp:true,
            // issuer:"http://localhost:3000",
            // audience:"http://localhost:3000",
            // notBefore:60*60,
            // jwtid:uuidv4()
        }
    });
successResponse({res,message:"user logged in successfully..👌",data:{access_token}})
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getProfile=async(req,res,next)=>{
    successResponse({res,data:{...req.user._doc,phone:decrypt(req.user.phone)}})
}
