import { Router } from "express";  
import userRouter from "../routes/user/user.routes.js"; 
import categoryRouter from "../routes/catalog/category/category.routes.js"; 
import productRouter from "../routes/catalog/product/product.routes.js";  
import cartRouter from "../routes/cart.routes.js"; 
import orderRouter from "../routes/order/order.routes.js"; 
import roleRouter from "../routes/user/role.routes.js"; 
import paymentRouter from "../routes/payment/payment.routes.js"; 
import systemRouter from '../routes/system.routes.js'

const router = Router();

const rootRoutes = [
  { path: "/user", route: userRouter },
  { path: "/category", route: categoryRouter },
  { path: "/product", route: productRouter },
  { path: "/cart", route: cartRouter },
  { path: "/order", route: orderRouter },
  { path: "/role", route: roleRouter },
  { path: "/payment", route: paymentRouter },
  { path: "/system", route: systemRouter },

];

rootRoutes.forEach(({path, route}) => {
  router.use(path, route)
})
export default router;