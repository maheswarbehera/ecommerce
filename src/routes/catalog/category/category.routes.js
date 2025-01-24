import { Router } from 'express' 
import verifyJwt from '../../../middlewares/auth.middleware.js'
import { categoryController } from '../../../controllers/catalog/category/category.controller.js'

const router = Router()

router.get('/',verifyJwt, categoryController.getAllCategories)
.post('/create',verifyJwt, categoryController.createCategory)
.get('/:id',verifyJwt, categoryController.getById)

export default router