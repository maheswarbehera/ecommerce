import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { cartController } from "../controllers/cart.controller.js";

const router = Router()

router.post('/add',verifyJwt, cartController.addToCart)
    .get('/',verifyJwt, cartController.getAllCartItems)

export default router