import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));


const dbPath = existsSync(join(__dirname, '../../items.db'))
  ? join(__dirname, '../../items.db')
  : join(__dirname, 'items.db'); 


let db = new Database(dbPath, {
  verbose: console.log,
  fileMustExist: false
});


export function initializeDatabase() {
 
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createTableSql);
  
  
}


export default db;