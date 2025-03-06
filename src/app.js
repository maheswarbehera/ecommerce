import express from 'express';
import userAgent from 'express-useragent'; 
import cors from 'cors'; 
import rateLimit from 'express-rate-limit'; 
import path from 'path';
import { fileURLToPath } from 'url';
import sharedRoutes from './routes/index.js';
import sharedUtils from './utils/index.js';
import sharedMiddlewares, { logger, requestLogger } from './middlewares/index.js'; 
import envConfig from './env.config.js'; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({limit:"10kb"}));
app.use(express.static("public"));   
app.use(userAgent.express());
app.use(requestLogger);
app.use(cors({ 
  origin: envConfig.CORS_ORIGIN, 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
// app.options('*', cors());

const { ApiError, ApiErrorResponse, asyncHandler, ApiSuccessResponse} = sharedUtils;
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: envConfig.RATE_LIMIT_MAX, // Limit each IP to 100 requests per windowMs
  message: `Too many requests, please try again after ${1 * 60} seconds`,
  statusCode: 429,
  headers: true,
  handler: function (req, res, next) {
    logger.warn(`[RateLimit Exceeded] IP: ${req.ip} - [${this.statusCode}] ${req.method} | ${req.originalUrl} | ${this.message}`);
    return ApiErrorResponse(this.statusCode, this.message, next);
  },
});

// app.use("/api/v1/user", sharedRoutes.userRouter)
// app.use("/api/v1/category", sharedRoutes.categoryRouter)
// app.use("/api/v1/product", sharedRoutes.productRouter)
// app.use("/api/v1/cart", sharedRoutes.cartRouter)
// app.use("/api/v1/order", sharedRoutes.orderRouter)
// app.use("/api/v1/role", sharedRoutes.roleRouter)
// app.use("/api/v1/payment", sharedRoutes.paymentRouter)
const urlMapping = `${envConfig.BASE_URL}${envConfig.API_VERSION}`;
app.use(urlMapping, apiLimiter);

const appRoutes = [
  { path: "/user", route: sharedRoutes.userRouter },
  { path: "/category", route: sharedRoutes.categoryRouter },
  { path: "/product", route: sharedRoutes.productRouter },
  { path: "/cart", route: sharedRoutes.cartRouter },
  { path: "/order", route: sharedRoutes.orderRouter },
  { path: "/role", route: sharedRoutes.roleRouter },
  { path: "/payment", route: sharedRoutes.paymentRouter },
];

appRoutes.forEach(({ path, route }) => {
  app.use(`${urlMapping}${path}`, route);
}); 

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "favicon.ico"));
});

app.get("/api/v1/",(req, res) => { 
  return ApiSuccessResponse(res, 200, null, `Server running on http://${envConfig.HOST}:${envConfig.PORT}${urlMapping}`); 
})

app.all('*', (req, res, next) => { 
  return ApiErrorResponse(404, `Route not found: ${req.method} ${req.originalUrl}`, next); 
});

app.use(sharedMiddlewares.errorHandler);

export default app;