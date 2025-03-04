import { Router } from 'express'  
import sharedMiddlewares from "../../../middlewares/index.js"
import sharedControllers from "../../../controllers/index.js" 

const router = Router()

// router.get('/',verifyJwt, categoryController.getAllCategories)
// .post('/saveOrUpdate',verifyJwt, categoryController.saveOrUpdate)
// .put('/edit/:id',verifyJwt, categoryController.saveOrUpdate)
// .delete('/:id',verifyJwt, categoryController.deleteCategory) 
// .get('/:id',verifyJwt, categoryController.getById)

const { verifyJwt } = sharedMiddlewares;
const { categoryController } = sharedControllers;

const routes = [
    {
        method: 'get',
        path: '/',
        handler: categoryController.getAllCategories,
        middlewares: [verifyJwt]
    },
    {
        method: 'post',
        path: '/saveOrUpdate',
        handler: categoryController.saveOrUpdate,
        middlewares: [verifyJwt]
    },
    {
        method: 'put',
        path: '/edit/:id',
        handler: categoryController.saveOrUpdate,
        middlewares: [verifyJwt]
    },
    {
        method: 'delete',
        path: '/:id',
        handler: categoryController.deleteCategory,
        middlewares: [verifyJwt]
    },
    {
        method: 'get',
        path: '/:id',
        handler: categoryController.getById,
        middlewares: [verifyJwt]
    },
     
]

routes.forEach(route => {
    if (route.middlewares && route.middlewares.length > 0) {
        router[route.method](route.path, ...route.middlewares, route.handler)
        // console.warn(`Registering middleware route: ${route.method.toUpperCase()} ${route.path}`)
    } else {
        router[route.method](route.path, route.handler)
        // console.warn(`Registering route: ${route.method.toUpperCase()} ${route.path}`)
    }
})
export default router