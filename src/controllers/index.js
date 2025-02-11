import {userController} from './user/user.controller.js';
import {categoryController} from './catalog/category/category.controller.js';
import {productController} from './catalog/product/product.controller.js';
import {cartController} from './cart.controller.js';
import {orderController} from './order/order.controller.js';
import {roleController} from './user/role.controller.js'; 

const sharedControllers = {
    userController,
    categoryController,
    productController,
    cartController,
    orderController,
    roleController, 
};

export default sharedControllers;