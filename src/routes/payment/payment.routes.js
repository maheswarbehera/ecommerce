import express from "express"; 
import { PaymentController } from "../../controllers/payment/payment.controller.js"; 

const router = express.Router();

router.post("/", PaymentController.processPayment);

export default router;
