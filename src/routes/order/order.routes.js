import { Router } from 'express' 
import sharedMiddlewares from "../../middlewares/index.js"
import sharedControllers from "../../controllers/index.js" 

const router =  Router()    

// router.post('/create', verifyJwt, orderController.placeOrder)
// .get('/', verifyJwt, orderController.getOrders)
const { verifyJwt } = sharedMiddlewares;
const { orderController } = sharedControllers;

const routes = [
    {
        method: 'post',
        path: '/create',
        handler: orderController.placeOrder,
        middlewares: [verifyJwt]
    },
    {
        method: 'get',
        path: '/',
        handler: orderController.getOrders,
        middlewares: [verifyJwt]
    }   
]

routes.forEach(route => {
    if(route.middlewares && route.middlewares.length > 0) {
        router[route.method](route.path, ...route.middlewares, route.handler)
        // console.warn(`Registering middleware route: ${route.method.toUpperCase()} ${route.path}`);
    }else{
       router[route.method](route.path, route.handler)
    //    console.warn(`Registering route: ${route.method.toUpperCase()} ${route.path}`);
    }
})

export default router