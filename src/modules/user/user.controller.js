import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../common/middleware/authentication.middleware.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { authorize } from "../../common/middleware/authorization.js";

const userRouter=Router();

userRouter.post("/Signup",US.signUp);
userRouter.post("/Signup/Gmail",US.signUpWithGmail);
userRouter.post("/Login",US.login);
userRouter.get("/Profile",authentication,authorize([RoleEnum.user]),US.getProfile);


export default userRouter;