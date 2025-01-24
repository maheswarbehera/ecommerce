import { Cart } from "../models/cart.model.js";
import { Product } from "../models/catalog/product/product.model.js";
import { User } from "../models/user/user.model.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, quantity } = req.body;

    if(!(productId || quantity)){
        return res.status(400).json({ status: false, message: "Product ID and quantity are required" });
    }
 
    const product = await Product.findById(productId);

    if(!product){
        return res.status(404).json({ status: false, message: "Product not found" });
    }
    
    if(product.stock < quantity){
        return res.status(400).json({ status: false, message: "Insufficient stock" });
    }

    // const user = await User.findById(userId).populate('cart.product');
    // console.log(user.username);
    // if(!user){
    //     return res.status(404).json({ status: false, message: "User not found" });
    // }

    // const existingCartItem = user.cart.find(item => item.product.toString() === productId);
    // // console.log(existingCartItem);
    // if(existingCartItem){
    //     existingCartItem.quantity += quantity;
    //     existingCartItem.total = existingCartItem.quantity * product.price;
    //     // console.log(existingCartItem);
    // }else{
    //     const total = quantity * product.price;
    //     user.cart.push({product: product, quantity, total});
    //     // console.log(user.cart);
    // }

    // await user.save();
    // return res.status(200).json({ status: true, cart: user.cart, message: "Product added to cart successfully" });

    const cart = await Cart.findOne({user: userId}).populate('items.product');
    if(!cart){
        console.log("No cart found, creating a new one for user:", userId);
        cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
        console.log("Updating existing cart item:", { productId, quantity });
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * product.price;
      } else {
        console.log("Adding new item to cart:", { productId, quantity });
        cart.items.push({
          product: product,
          quantity,
          total: quantity * product.price,
        });
      }
      
    await cart.save();
    return res.status(200).json({ status: true, cart, message: "Product added to cart successfully" });

  } catch (error) {
    return res.status(500).json({
        status: false,
        message: "An error occurred while adding to cart",
      });
  }
};

const getAllCartItems = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate('cart.product');
        if(!user){
            return res.status(404).json({ status: false, message: "User not found" });
        }

        return res.status(200).json({ status: true,  user });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "An error occurred while fetching cart items",
        });
    }
}


export const cartController = {
    getAllCartItems,
    addToCart,
}
