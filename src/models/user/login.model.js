
import mongoose, { Schema } from "mongoose";

const loginSchema = new Schema({
    loginAttempts: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: null
    },
    status: {
        type: Boolean
    },
    ipAddress: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
    browser: {
        type: String,
        default: null
    },
    device: {
        type: String,
        default: null
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})
export const LoginHistory = mongoose.model("LoginHistory", loginSchema);