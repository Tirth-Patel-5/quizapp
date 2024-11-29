import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express(); // Initialize app first

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5170', // Update to match your Vite app's port
    methods: ['GET', 'POST'],
    credentials: true
}));


app.options('*', cors()); // Handle preflight requests

app.use(bodyParser.json()); // Middleware for parsing JSON bodies

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quizapp',
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
});

// Route for user registration
app.post('/api/register', (req, res) => {
    const { username } = req.body;
    const query = 'INSERT INTO users (username) VALUES (?)';
    db.query(query, [username], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId });
    });
});

// Route for saving scores
app.post('/api/save-score', (req, res) => {
    const { userId, score } = req.body;
    const query = 'INSERT INTO scores (user_id, score) VALUES (?, ?)';
    db.query(query, [userId, score], (err, result) => {
        if (err) throw err;
        res.send('Score saved');
    });
});


// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
