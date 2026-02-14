import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../common/middleware/authentication.middleware.js";

const userRouter=Router();

userRouter.post("/Signup",US.signUp);
userRouter.post("/Login",US.login);
userRouter.get("/Profile",authentication,US.getProfile);


export default userRouter;