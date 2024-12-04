const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // Parse JSON request bodies

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  )
`);

// API Endpoints
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  db.run('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Item created successfully.' });
    }
  });
});

app.get('/api/items/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  });
});

app.put('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  db.run('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Item updated successfully.' });
    }
  });
});

app.patch('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const updateSql = [];
  const updateParams = [];
  if (name) {
    updateSql.push('name = ?');
    updateParams.push(name);
  }
  if (description) {
    updateSql.push('description = ?');
    updateParams.push(description);
  }
  if (updateSql.length > 0) {
    updateSql.push(`WHERE id = ${id}`);
    db.run(`UPDATE items SET ${updateSql.join(', ')}`, updateParams, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Item partially updated successfully.' });
      }
    });
  } else {
    res.status(400).json({ error: 'No fields provided for update.' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Item deleted successfully.' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Close database connection when server stops
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Closed the database connection.');
    }
    process.exit(0);
  });
});