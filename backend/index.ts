import express from 'express';
import cors from 'cors';
import { generateQrCode, generateTicketPDF } from './pdf_qr_generation';

// THESE ARE FOR TESTING ONLY, REMOVE ONCE DONE
import { Ticket } from './src/models/Ticket';
import { Status } from './src/models/Ticket';

//import sqlite3 from 'sqlite3';
//const db_path = './';
const app = express();
const port = 3001;
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}

// cors middleware
app.use(cors(corsOptions));

// Create or open an SQLite database
/*
const db = new sqlite3.Database(`${db_path}db.db`, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});
*/

// Basic route
app.get('/', (_req, res) => {
  res.send('Hello from the backend!');
});

app.get('/dummyTicket', async (_req, res) => {
  let ticket: Ticket = new Ticket(800, 200, 5, new Date(), null, Status.WAITING);
  generateTicketPDF(ticket);
  let qr = await generateQrCode(ticket);
  res.json({qr})
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
