import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface User extends Document {
    fullName: string,
    email: string,
    password: string,
    role: string,
    phone: string,
    shopId: ObjectId
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean
}

const userSchema: Schema<User> = new Schema({
    fullName: {
        type: String,
        required: [true, "Full Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        default: "customer"
    },
    phone: {
        type: String,
    }, 
    shopId: {
        type: mongoose.Types.ObjectId
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)

export default UserModel;