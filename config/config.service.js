
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