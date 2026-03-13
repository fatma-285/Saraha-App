
import dotenv from 'dotenv'
import {resolve} from 'node:path'
let envPaths={
    production:".env.production",
    development:".env.development"
}
const NODE_ENV=process.env.NODE_ENV;
dotenv.config({path:resolve(`config/${envPaths[NODE_ENV]}`)})


export const PORT=+process.env.PORT;
export const DB_URI=process.env.DB_URI;
export const SECRET_KEY=process.env.SECRET_KEY;
export const SALT_ROUNDS=+process.env.SALT_ROUNDS;
export const REFRESH_SECRET_KEY=process.env.REFRESH_SECRET_KEY;
export const PREFIX=process.env.PREFIX;

export const CLOUDINARY_CLOUD_NAME=+process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY=+process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET=+process.env.CLOUDINARY_API_SECRET;

export const REDIS_URL=process.env.REDIS_URL;