import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { authentication } from "../../common/middleware/authentication.middleware.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { authorize } from "../../common/middleware/authorization.js";
import { validation } from "../../common/middleware/validation.middleware.js";
import multer from "multer";
import { multer_host, multer_local } from "../../common/middleware/multer.js";
import { multer_enum } from "../../common/enums/multer.enum.js";

const userRouter = Router();

userRouter.post("/Signup",
    multer_host(multer_enum.image).fields([
        { name: "profilePicture", maxCount: 1 },
        { name: "coverPictures", maxCount: 5 },
    ]),
    validation(UV.signUpSchema),
      US.signUp);
userRouter.post("/Signup/Gmail", US.signUpWithGmail);
userRouter.post("/Login", validation(UV.signInSchema), US.login);
userRouter.post("/refresh-token", US.refreshToken);
userRouter.get("/Profile", authentication, authorize([RoleEnum.user]), US.getProfile);
userRouter.patch("/update-profile", authentication, US.updateProfile);
userRouter.patch("/update-password",authentication,validation(UV.updatePasswordSchema), US.updatePassword);
userRouter.get("/share-profile/:id",validation(UV.shareProfileSchema), US.shareProfile);
userRouter.post("/logout", authentication, US.logout);
userRouter.patch("/profile-Image",authentication,
    multer_host(multer_enum.image).fields([
    { name: "profilePicture", maxCount: 1 },
]),US.updateProfileImg);

userRouter.delete("/profile-Image",authentication,US.deleteProfileImg);
export default userRouter;