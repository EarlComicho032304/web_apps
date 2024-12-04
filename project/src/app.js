import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { itemsRouter } from './routes/items.js';
import { initializeDatabase } from './models/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use(helmet()); // Security headers
app.use(compression()); // GZIP compression

// Initialize database
initializeDatabase();

// Routes
app.use('/api/items', itemsRouter);

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

export default app;