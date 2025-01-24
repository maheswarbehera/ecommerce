import { Router } from "express"; 
import mongoose from "mongoose";

// import userController from "../controllers/user/user.controller.js";
import userController from "../../controllers/user/user.controller.js";
import verifyJwt from "../../middlewares/auth.middleware.js";  

const router = Router()


const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    next();
};


// router.route("/register").post(registerUser)
// router.route("/login").post(loginUser)
// router.route("/:id").get(verifyJwt, GetById)
// router.route("/logout").post(verifyJwt, logoutUser)
// router.route("/verify").get(verifyJwt)
// router.route("/").get(verifyJwt,allUser)
// router.route("/current-user").get(verifyJwt,userController.getCurrentUser)

// Public routes
router
    .post('/register', userController.registerUser)
    .post('/login', userController.loginUser);
    
    
    // Protected routes
router.use(verifyJwt);

router
    .post('/logout', userController.logoutUser) 
    .get('/', userController.allUser)
    .get('/current-user', userController.getCurrentUser)
    .get('/role', userController.userRole)
    .get('/:id',validateObjectId, userController.GetById)



export default router