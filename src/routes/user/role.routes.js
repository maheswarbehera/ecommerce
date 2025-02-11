import { Router } from "express" 
import sharedMiddlewares from "../../middlewares/index.js"
import sharedControllers from "../../controllers/index.js" 

const router = Router()
const { verifyJwt, validateObjectId } = sharedMiddlewares
const { roleController } = sharedControllers

const routes = [
    {
        method: 'post',
        path: '/create',
        handler: roleController.createRole,
        middlewares: [verifyJwt]
    },
    {
        method: 'post',
        path: '/permission',
        handler: roleController.getPermission,
        middlewares: [verifyJwt, validateObjectId]
    },
    {
        method: 'get',
        path: '/',
        handler: roleController.getRole,
        middlewares: [verifyJwt]
    }
]

routes.forEach(route => {
    if (route.middlewares && route.middlewares.length) {
        router[route.method](route.path, ...route.middlewares, route.handler)
        // console.warn(`Registering middleware route: ${route.method.toUpperCase()} ${route.path}`)
    } else {
        router[route.method](route.path, route.handler)
        // console.warn(`Registering route: ${route.method.toUpperCase()} ${route.path}`)
    }
})

// router.post('/create',  verifyJwt, RoleController.createRole)
//     .post('/permission', verifyJwt, RoleController.getPermission)
//     .get('/', verifyJwt, RoleController.getRole)

export default router