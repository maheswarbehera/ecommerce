import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission',
            required: true
        },]

},{
    timestamps: true
})

export const Role = mongoose.model("Role", roleSchema)