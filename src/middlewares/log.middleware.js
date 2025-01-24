
import fs from 'fs';

const logger = (req, res, next) => {
    // Log request details[]
    const logMessage = `Request at ${new Date()} ${req.method} ${req.ip} ${req.hostname} http://localhost:${process.env.PORT}${req.path}\n`;
    fs.appendFile('log.txt', logMessage, (err) => {
        if (err) {
            console.error(err);
        }
    });

    // Capture response on finish
    res.on('finish', () => {
        // Log response status
        const responseLogMessage = `Resolve at ${new Date()} ${req.method} ${req.ip} ${req.hostname} ${res.statusCode} http://localhost:${process.env.PORT}${req.path}\n`;
        fs.appendFile('log.txt', responseLogMessage, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });

    // Error handling
    res.on('error', (err) => {
        const errorLogMessage = `${new Date()} ERROR ${req.method} ${req.ip} ${req.hostname} ${err.message} http://localhost:${process.env.PORT}${req.path}\n`;
        fs.appendFile('log.txt', errorLogMessage, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });

    next();
}

export default logger;