import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import envConfig from "../../env.config.js";
import sharedModels from "../index.js";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        // required: true
    },
    logNum: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: null
    },
    uid: {
        type: String,
        unique: true
    }
    // cart: [
    //     {
    //         product: {
    //             type: Schema.Types.ObjectId,
    //             ref: 'Product',
    //             required: true,
    //         },
    //         quantity: {
    //             type: Number,
    //             default: 1,
    //             required: true,
    //             trim: true
    //         },
    //         total: {
    //             type: Number,
    //             default: 0,
    //             required: true,
    //             trim: true
    //         }
    //     }
    // ]
    
},{
    timestamps: true
})


//middleware hook password encrypt
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    if (!this.uid) {
        const { getNextConfig } = sharedModels; 
        this.uid = await getNextConfig("User","U");
    }
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id, 
            username: this.username,   
            role: this.role        
        },
        envConfig.ACCESS_TOKEN_SECRET,
        {
            // expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefresToken = function () {
    return jwt.sign(
        {
            _id: this._id        
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema)