import sharedModels from "../../models/index.js";
import sharedUtils from "../../utils/index.js";

const { Product, Order, OrderItem } = sharedModels;
const { asyncHandler, ApiErrorResponse, ApiSuccessResponse } = sharedUtils;

const placeOrder = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { orderItems, shippingAddress, phone, status, dateOrdered = Date.now()  } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
        return ApiErrorResponse(400, 'Order items cannot be empty', next); 
    }

    let totalPrice = 0;
    const orderItemsIds = await Promise.all(orderItems.map(async (orderItem) => {
        const product = await Product.findById(orderItem.product);
            if (!product) {
                return ApiErrorResponse(404, `Product with ID ${orderItem.product} not found`, next); 
            }

            // Calculate total for the current item
            const itemTotal = product.price * orderItem.quantity;
            totalPrice += itemTotal;

        const newOrderItem = new OrderItem({
            price: product.price,
            quantity: orderItem.quantity,
            product: orderItem.product,
            totalAmount: itemTotal
        });

        const savedOrderItem  = await newOrderItem.save();
        return savedOrderItem._id;
    }));
   
    const discount = totalPrice * 0.1;
    const charges = totalPrice * 0.05;
    const grandTotal = totalPrice - discount + charges;

    const createOrder = new Order({
        user: userId,
        orderItems: orderItemsIds,
        shippingAddress,
        phone,
        status,
        totalAmount: totalPrice,
        discount,
        charges,
        grandTotal: grandTotal,
        dateOrdered
    });
    const savedOrder = await createOrder.save();
    
    if (!savedOrder) {
        return ApiErrorResponse(400, 'Order could not be created', next); 
    }

    const populatedOrder = await Order.findById(savedOrder._id)
    .populate('user')
    .populate({
        path: "orderItems",
        populate: { path: "product", model: "Product" }
    });
    return ApiSuccessResponse(res, 201, {order: populatedOrder}, 'Order created successfully'); 
});

const getOrders = asyncHandler(async(req, res, next) => {
    const userId = req.user._id;     
    const orders = await Order.find({ user: userId }).populate('orderItems');

    if (!orders) return ApiErrorResponse(404, 'Error fetching orders', next);
    return ApiSuccessResponse(res, 200, orders, 'Orders fetched successfully');
})

export const orderController = {
    placeOrder,
    getOrders

} 