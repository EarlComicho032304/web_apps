import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

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