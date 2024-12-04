import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const __dirname = dirname(fileURLToPath(import.meta.url));

// Determine the database path based on the script's location
const dbPath = existsSync(join(__dirname, '../../items.db'))
  ? join(__dirname, '../../items.db')
  : join(__dirname, 'items.db'); // Default to the same directory if not found

export const dbConfig = {
  path: dbPath,
  options: {
    verbose: console.log,
    fileMustExist: false
  }
};

export const serverConfig = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default, but can be customized
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};