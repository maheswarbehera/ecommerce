import { Router } from "express" 
import verifyJwt from "../../middlewares/auth.middleware.js"
import { RoleController } from "../../controllers/user/role.controller.js"


const router = Router()

const routes = [
    {
        method: 'post',
        path: '/create',
        handler: RoleController.createRole,
        middlewares: [verifyJwt]
    },
    {
        method: 'post',
        path: '/permission',
        handler: RoleController.getPermission,
        middlewares: [verifyJwt]
    },
    {
        method: 'get',
        path: '/',
        handler: RoleController.getRole,
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