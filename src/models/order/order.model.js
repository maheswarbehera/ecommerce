import mongoose, {Schema} from 'mongoose'

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress: {
        address1: { type: String, required: true },
        address2: { type: String },
        city: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^\+?[1-9]\d{1,14}$/.test(v),
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    charges: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: true,
        default: 0
    },    
    dateOrdered: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
})

// Pre-save hook to calculate grandTotal
orderSchema.pre('save', function (next) {
    if (this.totalAmount >= 0 && this.discount >= 0 && this.charges >= 0) {
        this.grandTotal = this.totalAmount - this.discount + this.charges;
    }
    next();
});

export const Order = mongoose.model('Order', orderSchema)