import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFile = process.env.NODE_ENV === 'development' ? 'development.server.log' : 'production.server.log';

const logPath = path.resolve(__dirname, logFile);
console.log(logPath);

function readLastLines(filePath, lineCount = 50) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error("Log file not found"));
    }

    const lines = [];
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({ input: readStream });

    rl.on('line', (line) => {
      lines.push(line);
      if (lines.length > lineCount) lines.shift(); // Keep only the last N lines
    });

    rl.on('close', () => resolve(lines.join('\n')));
    rl.on('error', reject);
  });
}

// Run script
readLastLines(logPath, 50)
  .then(console.log)
  .catch(console.error);
