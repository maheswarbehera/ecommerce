import { Router } from 'express' 
import verifyJwt from '../../../middlewares/auth.middleware.js'
import { productController } from '../../../controllers/catalog/product/product.controller.js'

const router = Router()

// Protected routes
// router.use(verifyJwt);

// router
//     .get('/', productController.getAllProducts)
//     .post('/create', productController.createProduct)
//     .get('/category/:categoryName', productController.getProductByCategory)
//     .get('/:sku', productController.getById)
//     .get('/filter', productController.sortProduct);

const routes = [
    {
        method: 'get',
        path: '/',
        handler: productController.getAllProducts,
        middlewares: [verifyJwt]
    },
    {
        method: 'post',
        path: '/create',
        handler: productController.createProduct,
        middlewares: [verifyJwt]
    },
    {
        method: 'get',
        path: '/category/:categoryName',
        handler: productController.getProductByCategory,
        middlewares: [verifyJwt]
    },
    {
        method: 'get',
        path: '/:sku',
        handler: productController.getById,
        middlewares: [verifyJwt]
    },
    {
        method: 'get',
        path: '/filter',
        handler: productController.sortProduct,
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