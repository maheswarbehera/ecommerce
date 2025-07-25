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
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Username or email already exists
 */


/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [Users]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: User login successful
 *       400:
 *         description: Invalid username
 *       401:
 *         description: Invalid password
 *       422:
 *         description: Missing username or password
 */


/**
 * @swagger
 * /user/current-user:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 */

/**
 * @swagger
 * /user/id/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Log out current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 */

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
        {
          method: 'post',
          path: '/reset-password',
          handler: userController.resetPassword,
          middlewares: [verifyJwt]
        },
        {
          method: 'post',
          path: '/forgot-password',
          handler: userController.forgotPassword,
          middlewares: []
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