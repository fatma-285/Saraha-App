import { SECRET_KEY } from "../../../config/config.service.js";
import { verifyToken } from "../../common/utils/security/token.service.js";
import * as db_services from "../../DB/db_services.js";
import userModel from "../../DB/models/user.model.js";

export const authentication=async(req,res,next)=>{
     const {authorization}=req.headers;

     if(!authorization){
        throw new Error("unauthorized..",{cause:401})
     }

     //bearer token
     const [prefix,token]=authorization.split(" ");
     if(prefix!=="Bearer"||!token){
        throw new Error("invalid token prefix..",{cause:401})
     }

    const decoded=verifyToken({
        token,
        secret_key:SECRET_KEY
        ,options:{
        // ignoreExpiration:true
    }});

    if(!decoded||!decoded?.id){
        throw new Error("invalid token",{cause:401})
    }

    const user=await db_services.findOne({model:userModel,filter:{_id:decoded.id},options:{select:"-password"}});
    if(!user){
        throw new Error("user not found..🤷",{cause:400})
    }
    
    req.user=user;
    next();
}