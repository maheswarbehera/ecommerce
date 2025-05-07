import mongoose, { Schema } from "mongoose";

const auditSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    os: {type: String,},
    httpMethod: {type: String,},               
    route: {type: String,},              
    action: {type: String,},               
    reqBody: {type: Object,},                
    reqParams: {type: Object,},                
    reqQuery: {type: Object,},
    ip: {type: String,},
    device: {type: String,},
    platform: {type: String,},
    browser: {type: String,},
    statusCode: {type: Number,},
    responseTime: {type: String,},
    errorDetails: {type: Object,},
    timestamp: {Date}
}, {
    timestamps: true
})

export const Audit = mongoose.model("Audit", auditSchema)