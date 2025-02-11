
import userRouter from "../routes/user/user.routes.js"; 
import categoryRouter from "../routes/catalog/category/category.routes.js"; 
import productRouter from "../routes/catalog/product/product.routes.js";  
import cartRouter from "../routes/cart.routes.js"; 
import orderRouter from "../routes/order/order.routes.js"; 
import roleRouter from "../routes/user/role.routes.js"; 
import paymentRouter from "../routes/payment/payment.routes.js"; 

const sharedRoutes = {
    userRouter, 
    categoryRouter, 
    productRouter, 
    cartRouter, 
    orderRouter, 
    roleRouter, 
    paymentRouter,

}

export default sharedRoutes;