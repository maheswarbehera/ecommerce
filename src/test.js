import app from "./app";
import sharedModels from './models/index.js';
import readline from 'readline';
import fs from 'fs'; 
import { fileUpload } from './fileupload.js'; 
// upload image
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
      res.send(lines.join('\n')); // Send only the last 50 lines
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
  