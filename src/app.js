import express from 'express';
import userAgent from 'express-useragent';
import bodyParser from 'body-parser';
import cors from 'cors'; 
// import logger from './middlewares/log.middleware.js';
import userRouter from "./routes/user/user.routes.js"; 
import categoryRouter from "./routes/catalog/category/category.routes.js"; 
import productRouter from "./routes/catalog/product/product.routes.js";  
import cartRouter from "./routes/cart.routes.js"; 
import orderRouter from "./routes/order/order.routes.js"; 
import roleRouter from "./routes/user/role.routes.js"; 
import paymentRouter from "./routes/payment/payment.routes.js"; 
import { upload } from './middlewares/multer.middleware.js';
import { fileUpload } from './fileupload.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { logger, requestLogger } from './middlewares/winston.js';
import { ApiError } from './utils/ApiError.js';
import envConfig from './env.config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
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



app.post('/api/v1/upload', upload.single("image"),fileUpload);

app.use("/api/v1/user", userRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/order", orderRouter)
app.use("/api/v1/role", roleRouter)
app.use("/api/v1/payment", paymentRouter)

app.get('/api/v1/error', (req, res, next) => {
    const error = new ApiError(400,'This is a test error');
    // error.statusCode = 400; // Bad Request
    next(error);
});

app.use(errorHandler);

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

app.use(errorHandler);

export default app;