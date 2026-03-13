import mongoose from "mongoose";
import { RoleEnum, GenderEnum, ProviderEnum } from "../../common/enums/user.enum.js";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        require: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: function () {
            return this.provider == ProviderEnum.system ? true : false
        },
        trim: true,
        minLength: 6,
    },
    phone: {
        type: String,
        require: true,
        trim: true,
    },
    age: Number,
    gender: {
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.male
    },
    role: {
        type: String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.user
    },
    profilePicture: {
        public_id: { type: String },
        secure_url: { type: String }
    },
    coverPictures: [{
        public_id: { type: String},
        secure_url: { type: String }
    }],
    changeCredentials:Date,
    confirmed: Boolean,
    provider: {
        type: String,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.system
    },
    
},
    {
        timestamps: true,
        strictQuery: true,
        toJSON: {
            virtuals: true
        }
    })

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
}).set(function (fullName) {
    const [firstName, lastName] = fullName.split(" ");
    this.set({ firstName, lastName });
})



const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;