const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'quizapp',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

// Routes
app.post('/api/register', (req, res) => {
  const { username, email } = req.body;
  const sql = 'INSERT INTO users (username, email) VALUES (?, ?)';
  db.query(sql, [username, email], (err, result) => {
    if (err) {
      return res.status(500).send('Error registering user');
    }
    res.status(201).send('User registered');
  });
});

app.post('/api/save-score', (req, res) => {
  const { userId, score } = req.body;
  const sql = 'UPDATE users SET score = ? WHERE id = ?';
  db.query(sql, [score, userId], (err, result) => {
    if (err) {
      return res.status(500).send('Error saving score');
    }
    res.status(200).send('Score saved');
  });
});

app.get('/api/user/:id', (req, res) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching user data');
    }
    res.json(results[0]);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
