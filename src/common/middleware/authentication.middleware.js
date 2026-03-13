import { PREFIX, SECRET_KEY } from "../../../config/config.service.js";
import { verifyToken } from "../../common/utils/security/token.service.js";
import * as db_services from "../../DB/db_service.js";
import revokeTokenModel from "../../DB/models/revokeToken.model.js";
import userModel from "../../DB/models/user.model.js";
import { get, revoke_key} from "../../DB/redis/redis.service.js";

export const authentication = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error("unauthorized..", { cause: 401 })
    }

    //bearer token
    const [prefix, token] = authorization.split(" ");
    if (prefix !== PREFIX || !token) {
        throw new Error("invalid token prefix..", { cause: 401 })
    }

    const decoded = verifyToken({
        token,
        secret_key: SECRET_KEY
        , options: {
            // ignoreExpiration:true
        }
    });

    if (!decoded || !decoded?.id) {
        throw new Error("invalid token payload..", { cause: 401 })
    }

    const user = await db_services.findOne({ model: userModel, filter: { _id: decoded.id } });
    if (!user) {
        throw new Error("user not found..🤷", { cause: 400 })
    }

    if (user.changeCredentials?.getTime() > decoded.iat * 1000) {
        throw new Error("token expired..", { cause: 401 })
    }

    // const revokeToken = await db_services.findOne({ model: revokeTokenModel, filter: { tokenId: decoded.jti } });
    const revokeToken=await get(revoke_key({userId:user._id,jti:decoded.jti}));
    if (revokeToken) {
        throw new Error("invalid token revoked..", { cause: 401 })
    }

    req.user = user;
    req.decoded = decoded;
    next();
}