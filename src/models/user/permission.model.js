import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema({
    read: {
        type: Boolean,
        default: false,
        required: true
    },
    write: {
        type: Boolean,
        default: false,
        required: true
    },
    update: {
        type: Boolean,
        default: false,
        required: true
    },
    delete: {
        type: Boolean,
        default: false,
        required: true
    },
}, { timestamps: true });
 
 

export const Permission = mongoose.model('Permission', permissionSchema);
