import { Router } from 'express';
import TicketController from '../controllers/TicketController';

import ErrorHandler from './helper';


class TicketRoutes {

  private controller: TicketController;
  private router: Router;

   constructor() {
        console.log("Initializing TicketRoutes...");
        this.controller = new TicketController();
        this.router = Router();
        this.initRoutes();
    }

    /**
     * Returns the this.router instance.
     * @returns The this.router instance.
     */
    getRouter(): Router {
        return this.router;
    }


    initRoutes() {
    // Route to create a new ticket
    // POST /ticket
    this.router.post('/ticket', async (req: any, res: any) => {
      try {
        await this.controller.getTicket(req, res);
      } catch (error) {
        // in case of any unhndled errors
        res.status(500).json({ error: 'Something went wrong while processing your request.' });
      }
    });
    
    // Route to get a ticket by ID
    // GET /ticket/:ticket_id
    this.router.get('/ticket/:ticket_id', async (req: any, res: any) => {
      try {
        await this.controller.getTicketById(req, res);
      } catch (error) {
        // in case of any unhndled errors
        res.status(500).json({ error: 'Something went wrong while processing your request.' });
      }
    });
    
    // Route to get the queue status for all services
    // GET /queue/status
    this.router.get('/queue/status', async (req: any, res:any) => {
      try {
        await this.controller.getQueueStatus(req, res);
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong while processing your request.' });
      }
    });
    
    // Route to get the queue by service type ID
    // GET /queue/:service_id
    this.router.get('/queue/:service_id', async (req: any, res: any) => {
      try {
        await this.controller.getQueueByService(req, res);
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong while processing your request.' });
      }
    });
    
    // Route to update a ticket
    // PUT /ticket/:ticket_id
    this.router.put('/ticket/:ticket_id', async (req: any, res: any) => {
      try {
        await this.controller.updateTicket(req, res);
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong while processing your request.' });
      }
    });
    
    // Route to delete a ticket
    // DELETE /ticket/:ticket_id
    this.router.delete('/ticket/:ticket_id', async (req: any, res: any) => {
      try {
        await this.controller.deleteTicket(req, res);
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong while processing your request.' });
      }
    });
    
    }
}
export default TicketRoutes;
