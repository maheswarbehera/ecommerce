import {Order} from '../../models/order/order.model.js';
import {OrderItem} from '../../models/order/orderItem.model.js';
import {Product} from '../../models/catalog/product/product.model.js'; 


// const placeOrder = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { orderItems, shippingAddress1, shippingAddress2, city, zip, country, phone, status, dateOrdered = Date.now()  } = req.body;

//          // Validate required fields
//          if (!orderItems || orderItems.length === 0) {
//             return res.status(400).json({ message: 'Order items cannot be empty' });
//         }

//         let totalPrice = 0;

//         const orderItemsIds = Promise.all(orderItems.map(async (orderItem) => {

//             const product = await Product.findById(orderItem.product);
//                 if (!product) {
//                     throw new Error(`Product with ID ${orderItem.product} not found`);
//                 }

//                 // Calculate total for the current item
//                 const itemTotal = product.price * orderItem.quantity;
//                 totalPrice += itemTotal;
//                 console.log(totalPrice)
//                 console.log("itemTotal", itemTotal)

//             let newOrderItem = new OrderItem({
//                 quantity: orderItem.quantity,
//                 product: orderItem.product,
//                 totalAmount: itemTotal
//             });

           
//             const savedOrderItem  = await newOrderItem.save();
//             return savedOrderItem._id;
//         }));

         
//         const orderItemsIdsResolved = await orderItemsIds;
//         console.log(orderItemsIdsResolved)

//         if (!orderItemsIdsResolved) {
//             return res.status(400).json({ message: 'Order items cannot be empty' });
//         }
        
//         const discount = totalPrice * 0.1;
//         const charges = totalPrice * 0.05;
//         const grandTotal = totalPrice - discount + charges;
//         console.log(grandTotal)
        

//         const createOrder = new Order({
//             user: userId,
//             orderItems: orderItemsIdsResolved,
//             shippingAddress1,
//             shippingAddress2,
//             city,
//             zip,
//             country,
//             phone,
//             status,
//             totalAmount: totalPrice,
//             discount,
//             charges,
//             grandTotal: grandTotal,
//             dateOrdered
//         });
//         const savedOrder = await createOrder.save();
        
//         if (!savedOrder) {
//             return res.status(400).json({ message: 'Order could not be created' });
//         }

//         const populatedOrder = await Order.findById(savedOrder._id).populate('user');
//         return res.status(201).json({ message: 'Order created successfully', order: populatedOrder });

//     } catch (error) {
        
//         return res.status(500).json({ message: 'Error creating order', error });
//     }
// };


const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(userId)
        const { orderItems, shippingAddress1, shippingAddress2, city, zip, country, phone, status, dateOrdered = Date.now() } = req.body;

        // Validate required fields
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order items cannot be empty' });
        }

        let totalPrice = 0;

        // Create the order first to get its ID
        const createOrder = new Order({
            user: userId,
            orderItems: [], // Will be updated later
            shippingAddress1,
            shippingAddress2,
            city,
            zip,
            country,
            phone,
            status,
            totalAmount: 0, // Will be updated later
            discount: 0, // Will be updated later
            charges: 0, // Will be updated later
            grandTotal: 0, // Will be updated later
            dateOrdered
        });

        const savedOrder = await createOrder.save();

        if (!savedOrder) {
            return res.status(400).json({ message: 'Order could not be created' });
        }

        // Save order items with the order ID
        const orderItemsIds = await Promise.all(orderItems.map(async (orderItem) => {
            const product = await Product.findById(orderItem.product);
            if (!product) {
                throw new Error(`Product with ID ${orderItem.product} not found`);
            }

            // Calculate total for the current item
            const itemTotal = product.price * orderItem.quantity;
            totalPrice += itemTotal;

            // Create the order item with the order ID
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                orderId: savedOrder._id, // Save the order ID in the order item
                productId: product,
                totalAmount: itemTotal,
                price: product.price
                
            });

            const savedOrderItem = await newOrderItem.save();
            return savedOrderItem._id;
        }));

        // Update the order with the order items and calculated totals
        const discount = totalPrice * 0.1;
        const charges = totalPrice * 0.05;
        const grandTotal = totalPrice - discount + charges;

        savedOrder.orderItems = orderItemsIds;
        savedOrder.totalAmount = totalPrice;
        savedOrder.discount = discount;
        savedOrder.charges = charges;
        savedOrder.grandTotal = grandTotal;

        await savedOrder.save();

        // Populate the user and order items in the response
        const populatedOrder = await Order.findById(savedOrder._id)
            // .populate('user') 
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'productId',
                    model: 'Product'
                }
            });

        return res.status(201).json({ message: 'Order created successfully', order: populatedOrder });

    } catch (error) {
        return res.status(500).json({ message: 'Error creating order', error });
    }
};


const getOrders = async (req, res) => {
    const userId = req.user._id;
console.log(userId)
    try {
        const orders = await Order.find({ user: userId }).populate('orderItems');

        return res.status(200).json({ orders, message: 'Orders fetched successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching orders', error });
    }
}

export const orderController = {
    placeOrder,
    getOrders

} 