import { Router } from "express"; 
import sharedMiddlewares from "../../middlewares/index.js"
import sharedControllers from "../../controllers/index.js" 

const router = Router();

// router.route("/register").post(registerUser)
// router.route("/login").post(loginUser)
// router.route("/:id").get(verifyJwt, GetById)
// router.route("/logout").post(verifyJwt, logoutUser)
// router.route("/verify").get(verifyJwt)
// router.route("/").get(verifyJwt,allUser)
// router.route("/current-user").get(verifyJwt,userController.getCurrentUser)

// Public routes
// router
//     .post('/register', userController.registerUser)
//     .post('/login', userController.loginUser);
    
    
//     // Protected routes
// router.use(verifyJwt);

// router
//     .post('/logout', userController.logoutUser) 
//     .get('/', userController.allUser)
//     .get('/current-user', userController.getCurrentUser)
//     .get('/role', userController.userRole)
//     .get('/:id',validateObjectId, userController.GetById)
const { verifyJwt, validateObjectId } = sharedMiddlewares;
const { userController } = sharedControllers;

    const routes = [
        // Public routes (no auth required)
        {
          method: 'post',
          path: '/register',
          handler: userController.registerUser,
          middlewares: []  
        },
        {
          method: 'post',
          path: '/login',
          handler: userController.loginUser,
          middlewares: []
        },
      
        // Protected routes (JWT required)
        {
          method: 'post',
          path: '/logout',
          handler: userController.logoutUser,
          middlewares: [verifyJwt]
        },
        {
          method: 'get',
          path: '/',
          handler: userController.allUser,
          middlewares: [verifyJwt]
        },
        {
          method: 'get',
          path: '/current-user',
          handler: userController.getCurrentUser,
          middlewares: [verifyJwt]
        },
        {
          method: 'get',
          path: '/role',
          handler: userController.userRole,
          middlewares: [verifyJwt]
        },
        {
          method: 'get',
          path: '/id/:id',
          handler: userController.GetById,
          middlewares: [verifyJwt, validateObjectId]  
        },
    ];
      
    routes.forEach(route => {
    if (route.middlewares && route.middlewares.length > 0) {
        router[route.method](route.path, ...route.middlewares, route.handler); 
        // console.warn(`Registering middleware route: ${route.method.toUpperCase()} ${route.path}`);
    } else {
        router[route.method](route.path, route.handler); 
        // console.warn(`Registering route: ${route.method.toUpperCase()} ${route.path}`);
    }
    });

  //   routes.forEach(({ method, path, handler, middlewares }) => {
  //     router[method](path, ...middlewares, handler);
  //     console.log(`Registered Route: [${method.toUpperCase()}] ${path}`);
  // });

export default router