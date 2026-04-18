import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
        minlength: 1
    },
    attachements:[{
        public_id: { type: String},
        secure_url: { type: String }
    }],
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
},
    {
        timestamps: true,
        strictQuery: true,
    })

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema );

export default messageModel;