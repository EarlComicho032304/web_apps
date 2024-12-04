import { isProduction } from '../config.js'; // Import environment variable

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Customize error responses based on environment
  if (isProduction) {
    // Production: Send generic error message
    res.status(err.status || 500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong.'
    });
  } else {
    // Development: Send detailed error message
    res.status(err.status || 500).json({
      error: err.name,
      message: err.message,
      stack: err.stack // Include stack trace for debugging
    });
  }
};