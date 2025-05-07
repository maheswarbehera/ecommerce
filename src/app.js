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
import sharedModels from './models/index.js';
import readline from 'readline';
import fs from 'fs'; 
import { fileUpload } from './fileupload.js'; 
import { CSV } from './core/import.export.js'
import { loginHistory } from '../logs/index.js';
import auditDb from './middlewares/core/audit.middleware.js';

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
app.use(auditDb)

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


app.post('/api/v1/upload', sharedMiddlewares.upload.single("image"),fileUpload);
// view uploaded image
app.get('/api/v1/public/temp/:path', (req, res) => {
  const { path: requestedPath } = req.params;
  
  // Avoid directory traversal by sanitizing the path
  const sanitizedPath = path.join('public', 'temp', requestedPath);
  const absolutePath = path.resolve(sanitizedPath);

  // Ensure the path is within the 'public/temp' directory
  if (!absolutePath.startsWith(path.resolve('public', 'temp'))) {
    return res.status(400).send('Invalid file path');
  }

  res
    .status(200)
    .sendFile(absolutePath);
});

// Testing api routes
app.get('/api/v1/error', (req, res, next) => {
    const error = new ApiError(400,'This is a test error');
    // error.statusCode = 400; // Bad Request
    next(error);
});

// serverside render
app.get("/api/v1/ssr", (req, res) => {
    res.render('index', { host: envConfig.HOST, port: envConfig.PORT });
});
app.get("/",sharedMiddlewares.verifyJwt, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// display last 50 line logs...
app.get(`${urlMapping}/logs`, asyncHandler(async(req, res, next) => {
    const logFile = envConfig.NODE_ENV === 'development' ? 'development.server.log' : 'production.server.log';
    const logPath = path.resolve(__dirname, '../logs', logFile); 
    
    if (!fs.existsSync(logPath)) {
      return ApiErrorResponse(404, 'Log file not found', next);
    }
  
    res.setHeader('Content-Type', 'text/plain');
    const lines = [];
    const readStream = fs.createReadStream(logPath, { encoding: 'utf-8' });
    const rl = readline.createInterface({ input: readStream });
  
    rl.on('line', (line) => {
      lines.push(line);
      if (lines.length > 50) lines.shift(); // Keep only the last 50 lines
    });
  
    rl.on('close', () => {
      res.send(lines); // Send only the last 50 lines
    });
}));

// user preferences
app.get("/api/v1/user/preferences",sharedMiddlewares.verifyJwt, async (req, res) => {
    const userId = req.user;
    const preference = await sharedModels.UserPreference.findOne({ userId });
    res.json({ preferences: preference ? preference.preferences : { name: true, price: true, sku: true, stock: true } });
  });
  
app.post("/api/v1/user/preferences/save",sharedMiddlewares.verifyJwt, async (req, res) => {
    const userId = req.user;  
    const { preferences } = req.body;
    const updatedPref = await sharedModels.UserPreference.findOneAndUpdate(
        { userId },
        { $set: { preferences } }, 
        { upsert: true, new: true }
    );
    res.json({ message: "Preferences saved successfully", data: updatedPref });
});
  
app.get("/api/v1/loginHistory",sharedMiddlewares.verifyJwt, loginHistory);
app.get("/api/v1/export-csv/:name", sharedMiddlewares.verifyJwt,CSV.exportCsv)
app.post("/api/v1/import-csv", sharedMiddlewares.verifyJwt, sharedMiddlewares.upload.single("file"), CSV.importCsv)
app.all('*', (req, res, next) => { 
  return ApiErrorResponse(404, `Route not found: ${req.method} ${req.originalUrl}`, next); 
});

app.use(sharedMiddlewares.errorHandler);

export default app;