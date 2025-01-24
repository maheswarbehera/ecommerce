import mongoose, { Schema } from "mongoose"

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        trim: true
    },
    category: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Category',
          required: true,
        },
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
},{
    timestamps: true
})
    
export const Product = mongoose.model("Product", productSchema)