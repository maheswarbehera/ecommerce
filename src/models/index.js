import mongoose, { Schema } from "mongoose";
import { User } from "./user/user.model.js";
import { Category } from "./catalog/category/category.model.js";
import { Product } from "./catalog/product/product.model.js";
import { Cart } from "./cart.model.js";
import { Order } from "./order/order.model.js";
import { OrderItem } from "./order/orderItem.model.js";
import { Role } from "./user/role.model.js"; 
import { Permission } from "./user/permission.model.js";
import { UserPreference } from "./preference.model.js";

const configSchema = new Schema({
    schema: { type: String, required: true },   
    incrementPrefix: { type: String },
    incrementPadChar: { type: String, default: "0" }, 
    incrementPadLength: { type: Number, default: 6 },
    includeDate: { type: Boolean, default: true }, 
    incrementLastId: { type: Number, required: true, default: 0 },
    incrementLastFinal: { type: String, default: "" },
});
 
const Config = mongoose.model("Config", configSchema);

const getNextConfig = async (schemaName, prefix) => {
    const config = await Config.findOneAndUpdate(
        { schema: schemaName }, 
        { $inc: { incrementLastId: 1 }}, 
        { new: true, upsert: true }
    );  
    config.incrementPrefix = prefix;
    if (config.includeDate) {
        prefix += `-${new Date().getFullYear().toString() + 
                    (new Date().getMonth() + 1).toString().padStart(2, "0") + 
                    new Date().getDate().toString().padStart(2, "0")}`;        
    }  
    
    const finalId = `${prefix}-${config.incrementLastId.toString().padStart(config.incrementPadLength, config.incrementPadChar)}`;
    config.incrementLastFinal = finalId;
    await config.save();
    return finalId;
};

const sharedModels = {
    User,
    Category,
    Product,
    Cart,
    Order,
    OrderItem,
    Role, 
    Permission,
    Config,
    getNextConfig,
    UserPreference
};

export default sharedModels;
