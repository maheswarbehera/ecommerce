import { Router } from "express"; 
import { cacheController } from "../controllers/cache.controller.js";

const router = Router();

const routes = [
    {
        method: 'get',
        path: '/cache',
        handler: cacheController.getCache,
        middlewares: []  
    },
    {
        method: 'delete',
        path: '/cache/clear',
        handler: cacheController.clearCache,
        middlewares: []
    }
]

routes.forEach(({method, path, handler, middlewares}) => {
    router[method](path, ...middlewares, handler)
})

export default router;