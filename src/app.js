import express from 'express';
import userAgent from 'express-useragent';
import bodyParser from 'body-parser';
import cors from 'cors'; 
import rateLimit from 'express-rate-limit'; 
import path from 'path';
import { fileURLToPath } from 'url';

import sharedRoutes from './routes/index.js';
import sharedUtils from './utils/index.js';
import sharedMiddlewares, { logger, requestLogger } from './middlewares/index.js'; 
import { fileUpload } from './fileupload.js'; 
import envConfig from './env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({limit:"10kb"})); 
app.use(bodyParser.json());
app.use(cors());
app.use(userAgent.express());
app.use(requestLogger);
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', envConfig.CORS_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const { ApiError, ApiErrorResponse } = sharedUtils;
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

app.use('/api/v1', apiLimiter);

app.post('/api/v1/upload', sharedMiddlewares.upload.single("image"),fileUpload);

app.use("/api/v1/user", sharedRoutes.userRouter)
app.use("/api/v1/category", sharedRoutes.categoryRouter)
app.use("/api/v1/product", sharedRoutes.productRouter)
app.use("/api/v1/cart", sharedRoutes.cartRouter)
app.use("/api/v1/order", sharedRoutes.orderRouter)
app.use("/api/v1/role", sharedRoutes.roleRouter)
app.use("/api/v1/payment", sharedRoutes.paymentRouter)

app.get('/api/v1/error', (req, res, next) => {
    const error = new ApiError(400,'This is a test error');
    // error.statusCode = 400; // Bad Request
    next(error);
});

app.get('/api/v1/staff/:id', (req, res) => {
    console.log(req.route); // Logs route details
    res.json({
      routeDetails: req.route,
    });
  });
  
app.get("/api/v1/",(req, res) => { 
    res.status(200).json(`Server running on http://${envConfig.HOST}:${envConfig.PORT}/api/v1/`)
})
app.get("/api/v1/ssr", (req, res) => {
  res.render('index', { host: envConfig.HOST, port: envConfig.PORT });
});

app.all('*', (req, res) => {
  logger.warn(`No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ status: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(sharedMiddlewares.errorHandler);

export default app;