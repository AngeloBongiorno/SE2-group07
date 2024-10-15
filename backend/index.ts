import express from 'express';
import cors from 'cors';

import { generateQrCode, generateTicketPDF } from './src/pdf_qr_generation';
import initRoutes from './src/routes';

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
initRoutes(app);



// Basic route
app.get('/', (_req, res) => {
  res.send('Hello from the backend!');
});


// test route for generationg a dummy ticket in the tickets folder, sends back the qr embedding the link to the ticket
app.get('/dummyTicket', async (_req, res) => {
  let ticket: Ticket = new Ticket(420, 9999, 5, new Date(), null, Status.WAITING);
  generateTicketPDF(ticket);
  let qr = await generateQrCode(ticket);
  res.json({qr})
});

/*app.get('/officequeue/nextCustomer', (req, res) => {
  res.send('Test route /officequeue/nextCustomer works!');
});*/

initRoutes(app);


app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
