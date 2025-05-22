import mongoose, { Schema } from "mongoose"
import sharedModels from "../../index.js"; 
import auditDbLog from "../../../utils/auditLog.js";

const categorySchema = new Schema({
    uid: { type: String, unique: true},
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 32,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
},{
    timestamps: true
})

categorySchema.pre("save", async function (next) {
    try {
        if (!this.uid) {
            const { getNextConfig } = sharedModels; 
            this.uid = await getNextConfig("Category","CAT");
        }
        next();
    } catch (error) {
        next(error)
    }
});

categorySchema.plugin(auditDbLog, 'Category')
export const Category = mongoose.model("Category", categorySchema)