import { Router } from 'express';
import TicketController from '../controllers/TicketController';

const router = Router();

// Route to create a new ticket
// POST /ticket
router.post('/ticket', TicketController.getTicket);

// Route to get a ticket by ID
// GET /ticket/:ticket_id
router.get('/ticket/:ticket_id', TicketController.getTicketById);

// Route to get the queue status for all services
// GET /queue/status
router.get('/queue/status', TicketController.getQueueStatus);

// Route to get the queue by service type ID
// GET /queue/:service_id
router.get('/queue/:service_id', TicketController.getQueueByService);

// // Route to estimate waiting time for a ticket
// // GET /queue/estimate-time/:ticket_id
// router.get('/queue/estimate-time/:ticket_id', TicketController.estimateWaitingTime);

// Route to update a ticket
// PUT /ticket/:ticket_id
router.put('/ticket/:ticket_id', TicketController.updateTicket);

// Route to delete a ticket
// DELETE /ticket/:ticket_id
router.delete('/ticket/:ticket_id', TicketController.deleteTicket);

export default router;
