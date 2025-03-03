import mongoose,{Schema} from 'mongoose'

const orderItemSchema = new Schema({  
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    }, 
}, {
    timestamps: true
})

orderItemSchema.pre('save', function (next) {
    if (this.price >= 0 && this.quantity >= 0) {
        this.totalAmount = this.price * this.quantity;
    }
    next();
});
export const OrderItem = mongoose.model('OrderItem', orderItemSchema)