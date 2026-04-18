import { Router } from "express";
import * as MS from "./message.service.js";
import * as MV from "./message.validation.js";
import { multer_host } from "../../common/middleware/multer.js";
import { multer_enum } from "../../common/enums/multer.enum.js";
import { validation } from "../../common/middleware/validation.middleware.js";
import { authentication } from "../../common/middleware/authentication.middleware.js";
const messageRouter = Router({mergeParams:true});

messageRouter.post("/send",
    multer_host(multer_enum.image).fields([
        { name: "attachements", maxCount: 3 },
    ]),
    validation(MV.sendMessageSchema),
    MS.sendMessage
);

//!user messages
//  /user/:userId/messages
messageRouter.get("/",
    authentication,
    MS.getMessages
)

messageRouter.get("/all-messages",
    authentication,
    MS.getAllMessages
)

messageRouter.get("/:messageId",
    authentication,
    validation(MV.getMessageSchema),
    MS.getMessage
);


export default messageRouter;