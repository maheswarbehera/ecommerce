import { Router } from "express" 
import verifyJwt from "../../middlewares/auth.middleware.js"
import { RoleController } from "../../controllers/user/role.controller.js"


const router = Router()


router.post('/create',  verifyJwt, RoleController.createRole)
    .post('/permission', verifyJwt, RoleController.getPermission)
    .get('/', verifyJwt, RoleController.getRole)

export default router