import { Router } from 'express' 
import verifyJwt from '../../../middlewares/auth.middleware.js'
import { productController } from '../../../controllers/catalog/product/product.controller.js'

const router = Router()

// Protected routes
router.use(verifyJwt);

router
    .get('/', productController.getAllProducts)
    .post('/create', productController.createProduct)
    .get('/category/:categoryName', productController.getProductByCategory)
    .get('/:sku', productController.getById)
    .get('/filter', productController.sortProduct);

export default router