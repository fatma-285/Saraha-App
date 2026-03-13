import { ProviderEnum } from "../../common/enums/user.enum.js";
import userModel from "../../DB/models/user.model.js";
import * as db_services from "../../DB/db_service.js";
import { successResponse } from "../../common/utils/response.success.js";
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import { generateToken, verifyToken } from "../../common/utils/security/token.service.js";
import { OAuth2Client } from 'google-auth-library';
import { PREFIX, REFRESH_SECRET_KEY, SECRET_KEY } from "../../../config/config.service.js";
import cloudinary from "../../common/utils/cloudinary.js";
import revokeTokenModel from "../../DB/models/revokeToken.model.js";
import { randomUUID } from "crypto"
import { del, get, get_key, keys, revoke_key, set } from "../../DB/redis/redis.service.js";

export const signUp = async (req, res, next) => {
    try {
        const { fullName, email, password, confirmPassword, gender, age, phone, profilePicture, coverPictures } = req.body;
        // console.log("file after",req.file);

        // if(!fullName||!email||!password||!confirmPassword||!gender||!age||!phone || !profilePicture ){
        //     throw new Error("all fields are required..",{cause:400})
        // }

        if (await db_services.findOne({ model: userModel, filter: { email } })) {
            throw new Error("user already exist..🤷‍♀️", { cause: 400 })
        }
        if (password !== confirmPassword) {
            throw new Error("passwords do not match..", { cause: 400 })
        }

        const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.profilePicture[0].path, {
            folder: "Saraha_App/users",
            // public_id:"fatma",
            // use_filename:true,
            // unique_filename:false,
            // resource_type:"image"
        });

        let arr_paths = [];

        for (const file of req.files.coverPictures) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, {
                folder: "Saraha_App/users/covers"
            });
            arr_paths.push({
                public_id,
                secure_url
            })
        }
        const user = await db_services.create({
            model: userModel,
            data: {
                fullName,
                email,
                password: Hash({ cipherText: password }),
                gender, age, phone: encrypt(phone),
                profilePicture: {
                    public_id,
                    secure_url
                },
                coverPictures: arr_paths
            }
        });
        if (!user) {
            await cloudinary.uploader.destroy(public_id);
            throw new Error("failed to create user..😢🤷‍♀️", { cause: 500 })
        }
        successResponse({ res, status: 201, message: "user created successfully..👌", data: { user } })
    } catch (error) {
        throw new Error(error.message)
    }
}

export const signUpWithGmail = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        console.log({ idToken });
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience: "434943204420-roidgnlijsdckhkud1p5961umadcj412.apps.googleusercontent.com",
        });
        const payload = ticket.getPayload();
        console.log(payload);
        const { email, name, picture, email_verified } = payload;
        let user = await db_services.findOne({ model: userModel, filter: { email } });
        if (!user) {
            //register
            user = await db_services.create({
                model: userModel, data: {
                    email,
                    fullName: name,
                    profilePicture: picture,
                    confirmed: email_verified,
                    provider: ProviderEnum.google
                }
            });
        }
        //login
        if (user.provider !== ProviderEnum.google) {
            throw new Error("provider is not google", { cause: 400 })
        }
        const access_token = generateToken({
            payload: { id: user._id, email: user.email, role: user.role },
            secret_key: SECRET_KEY,
            options: {
                expiresIn: "1d",
            }
        });
        successResponse({ res, message: "user logged in successfully..👌", data: { access_token } })
    } catch (error) {
        throw new Error(error.message)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("all fields are required..", { cause: 400 })
        }
        const user = await db_services.findOne({ model: userModel, filter: { email, provider: ProviderEnum.system } });
        if (!user) {
            throw new Error("user not found..🤷", { cause: 400 })
        }
        const match = Compare({ plainText: password, cipherText: user.password });
        if (!match) {
            throw new Error("wrong password..", { cause: 400 })
        }

        const jwtid = randomUUID();

        const access_token = generateToken({
            payload: { id: user._id, email: user.email, role: user.role },
            secret_key: SECRET_KEY,
            options: {
                expiresIn: "1d",
                jwtid
                // noTimestamp:true,
                // issuer:"http://localhost:3000",
                // audience:"http://localhost:3000",
                // notBefore:60*60,
                // jwtid:uuidv4()
            }
        });
        const refresh_token = generateToken({
            payload: { id: user._id, email: user.email, role: user.role },
            secret_key: REFRESH_SECRET_KEY,
            options: {
                expiresIn: "1y",
                jwtid
            }
        });
        successResponse({ res, message: "user logged in successfully..👌", data: { access_token, refresh_token } })
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getProfile = async (req, res, next) => {
    const key=`profile::${req.user._id}`;
    const userExist=await get(key);
    if(userExist){
        return successResponse({ res, data: { ...userExist, phone: decrypt(userExist.phone) } })
    }
    await set({
        key,
        value:req.user,
        ttl:60*60
    })
    successResponse({ res, data: { ...req.user._doc, phone: decrypt(req.user.phone) } })
}

export const refreshToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new Error("token not found");
    }

    const [prefix, token] = authorization.split(" ");
    if (prefix !== PREFIX || !token) {
        throw new Error("invalid token prefix");
    }

    const decoded = verifyToken({ token, secret_key: REFRESH_SECRET_KEY });
    if (!decoded || !decoded?.id) {
        throw new Error("invalid token");
    }

    const user = await db_services.findOne({
        model: userModel,
        filter: {
            _id: decoded.id
        },
        options: {
            select: "-password"
        }
    });

    if (!user) {
        throw new Error("user not found");
    }

    const revokeToken = await db_services.findOne({ model: revokeTokenModel, filter: { tokenId: decoded.jti } });
    if (revokeToken) {
        throw new Error("invalid token revoked..", { cause: 401 })
    }

    const access_token = generateToken({
        payload: { id: user._id, email: user.email, role: user.role },
        secret_key: SECRET_KEY,
        options: {
            expiresIn: "1d",
        }
    });

    successResponse({ res, message: "user logged in successfully..👌", data: { access_token } })
}

export const shareProfile = async (req, res, next) => {
    const { id } = req.params;
    const user = await db_services.findOne({ model: userModel, filter: { _id: id }, options: { select: "-password" } });
    if (!user) {
        throw new Error("user not found..🤷", { cause: 400 })
    }
    successResponse({ res, data: { ...user._doc, phone: decrypt(user.phone) } })
}

export const updateProfile = async (req, res, next) => {
    let { firstName, lastName, gender, age, phone } = req.body;
    if (phone) {
        phone = encrypt(phone);
    }
    const user = await db_services.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        update: { firstName, lastName, gender, age, phone }
    });
    if (!user) {
        throw new Error("user not found..🤷", { cause: 400 })
    }
    await del(`profile::${req.user._id}`);
    successResponse({ res, data: user })
}
export const updatePassword = async (req, res, next) => {
    let { oldPassword, newPassword } = req.body;

    if (!Compare({ plainText: oldPassword, cipherText: req.user.password })) {
        throw new Error("wrong old password..", { cause: 400 })
    }

    const hash = Hash({ cipherText: newPassword });

    req.user.password = hash;

    await req.user.save();

    successResponse({ res })
}

export const logout = async (req, res, next) => {
    const { flag } = req.query;
    if (flag === "all") {
        req.user.changeCredentials = new Date();
        await req.user.save();
        // await db_services.deleteMany({ model: revokeTokenModel, filter: { userId: req.user._id } });
        await del(await keys(get_key({userId:req.user._id})));
    } else {
        // await db_services.create({
        //     model: revokeTokenModel,
        //     data: {
        //         tokenId: req.decoded.jti,
        //         userId: req.user._id,
        //         expiredAt: new Date(req.decoded.exp * 1000+  60 * 30 * 1000)
        //     }
        // })
        await set({
            key:revoke_key({userId:req.user._id,jti:req.decoded.jti}),
            value:`${req.decoded.jti}`,
            ttl:req.decoded.exp-Math.floor(Date.now() / 1000)
        })
    }
    successResponse({ res })
}

export const updateProfileImg=async(req,res,next)=>{
    if(!req.files.profilePicture){
        throw new Error("profile picture required..", { cause: 400 })
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.profilePicture[0].path, {
           folder: "Saraha_App/users",
       });
    const user=await db_services.findOne({
        model:userModel,
        filter:{_id:req.user._id},
    })
    if(!user){
        await cloudinary.uploader.destroy(public_id);
        throw new Error("user not found..🤷", { cause: 400 })
    }

    if(user.profilePicture.public_id){
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }

    user.profilePicture={
        public_id,
        secure_url
    };

    await user.save();
    successResponse({res})
}

export const deleteProfileImg=async(req,res,next)=>{
    const user=await db_services.findOne({
        model:userModel,
        filter:{_id:req.user._id},
    })
    if(!user){
        throw new Error("user not found..🤷", { cause: 400 })
    }
    if(user.profilePicture.public_id){
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }
    user.profilePicture=null;
    await user.save();
    successResponse({res})
}