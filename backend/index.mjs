import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const db_path = './';
const app = express();
const port = 3001;
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}

// cors middleware
app.use(cors(corsOptions));

// Create or open an SQLite database
const db = new sqlite3.Database(`${db_path}db.db`, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
