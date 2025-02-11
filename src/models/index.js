import { User } from "./user/user.model.js";
import { Category } from "./catalog/category/category.model.js";
import { Product } from "./catalog/product/product.model.js";
import { Cart } from "./cart.model.js";
import { Order } from "./order/order.model.js";
import { OrderItem } from "./order/orderItem.model.js";
import { Role } from "./user/role.model.js"; 
import { Permission } from "./user/permission.model.js";

const sharedModels = {
    User,
    Category,
    Product,
    Cart,
    Order,
    OrderItem,
    Role, 
    Permission,
};

export default sharedModels;
