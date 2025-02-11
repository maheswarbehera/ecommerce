import { Router } from "express"; 
import sharedMiddlewares from "../middlewares/index.js"
import sharedControllers from "../controllers/index.js" 

const router = Router()

// router.post('/add',verifyJwt, cartController.addToCart)
//     .get('/',verifyJwt, cartController.getAllCartItems)

const { verifyJwt } = sharedMiddlewares;
const { cartController } = sharedControllers;

    const routes = [
        {
            method: 'post',
            path: '/add',
            handler: cartController.addToCart,
            middlewares: [verifyJwt]
        },
        {
            method: 'get',
            path: '/',
            handler: cartController.getAllCartItems,
            middlewares: [verifyJwt]    
        }
    ]

    routes.forEach(route => {
        if(route.middlewares && route.middlewares.length > 0) {
            router[route.method](route.path, ...route.middlewares, route.handler)
            // console.warn(`Registering middleware route: ${route.method.toUpperCase()} ${route.path}`)
        } else {
            router[route.method](route.path, route.handler)
            // console.warn(`Registering route: ${route.method.toUpperCase()} ${route.path}`)
        }
    })
export default router