import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { authentication } from "../../common/middleware/authentication.middleware.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { authorize } from "../../common/middleware/authorization.js";
import { validation } from "../../common/middleware/validation.middleware.js";

const userRouter = Router();



userRouter.post("/Signup", validation(UV.signUpSchema), US.signUp);
userRouter.post("/Signup/Gmail", US.signUpWithGmail);
userRouter.post("/Login", validation(UV.signInSchema), US.login);
userRouter.get("/Profile", authentication, authorize([RoleEnum.user]), US.getProfile);


export default userRouter;