import mongoose, { Schema }from "mongoose"; 

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items:[{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            trim: true,
            min: [1, "Quantity must be at least 1"],
        },
        total: {
            type: Number,
            default: 0,
            required: true,
            trim: true
        }
    }],
    totalAmount: {
        type: Number,
        default: 0,
        required: true,
        trim: true
    }
   
},{
    timestamps: true
})

cartSchema.pre('save', async function(next){
    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);     
    next();
})

export const Cart = mongoose.model("Cart", cartSchema)