import mongoose from "mongoose";

export const connectDB=async()=>{
await mongoose.connect("mongodb://127.0.0.1:27017/SarahaApp",({serverSelectionTimeoutMS:5000}))
.then(()=>{
    console.log("DB connected successfully..🎉");
}).catch((err)=>{
    console.log("failed to connect to DB..😢🤷‍♀️");
})
}