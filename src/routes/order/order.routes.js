import { Router } from 'express'
import { orderController } from '../../controllers/order/order.controller.js'
import verifyJwt from '../../middlewares/auth.middleware.js'

const router =  Router()    

router.post('/create', verifyJwt, orderController.placeOrder)
.get('/', verifyJwt, orderController.getOrders)

export default router