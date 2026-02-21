import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

export const connectDB=async()=>{
await mongoose.connect(DB_URI,({serverSelectionTimeoutMS:5000}))
.then(()=>{
    console.log(`${DB_URI} connected successfully..🎉` );
}).catch((err)=>{
    console.log("failed to connect to DB..😢🤷‍♀️");
})
}