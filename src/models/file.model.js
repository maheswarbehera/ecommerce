import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
    fileData: { type: Buffer, required: true },
    fileType: { type: String, required: true },
    fileExtension: { type: String, required: true },
    fileName: { type: String },
    size: { type: String },
})

const fileModel = mongoose.model('Files', fileSchema)
export default fileModel