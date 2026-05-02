const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create transactions table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
        )`);
    }
});

// Routes

// Get all transactions
app.get('/api/transactions', (req, res) => {
    const sql = 'SELECT * FROM transactions ORDER BY date DESC, id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add a new transaction
app.post('/api/transactions', (req, res) => {
    const { title, amount, category, date } = req.body;
    if (!title || !amount || !category || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'INSERT INTO transactions (title, amount, category, date) VALUES (?, ?, ?, ?)';
    const params = [title, amount, category, date];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id: this.lastID,
            title,
            amount,
            category,
            date
        });
    });
});

// Delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM transactions WHERE id = ?';
    
    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted', changes: this.changes });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
