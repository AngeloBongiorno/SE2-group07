import { Request, Response } from 'express';
import TicketDAO from '../dao/TicketDao';
import { Status } from '../models/Ticket';
import { InvalidInputError, ItemNotFoundError, ItemAlreadyExistsError } from '../dao/errors';

class TicketController {

    private ticketDAO: TicketDAO;

    constructor() {
        this.ticketDAO = new TicketDAO();
    }
    
    public async getTicket(req: Request, res: Response): Promise<void> {
        const { service_type_id } = req.body;

        if (!service_type_id) {
            res.status(400).json({ error: 'Invalid input: service_type_id is required.' });
            return;
        }

        try {
            // Fetch all tickets to calculate the queue position for the new ticket
            const allTickets = await this.ticketDAO.getAllTickets();
            const queuePosition = allTickets.filter(ticket => ticket.service_type_id === service_type_id).length + 1;

            // Create a new ticket
            const success = await this.ticketDAO.createTicket(service_type_id, queuePosition, new Date());

            if (success) {
                res.status(200).json({ message: 'Ticket created successfully', service_type_id, queue_position: queuePosition });
            }
        } catch (error) {
            if (error instanceof InvalidInputError) {
                res.status(400).json({ error: 'Invalid input data.' });
            } else if (error instanceof ItemAlreadyExistsError) {
                res.status(409).json({ error: 'Ticket already exists.' });
            } else {
                res.status(500).json({ error: 'Internal server error.' });
            }
        }
    }

    // GET /ticket/:ticket_id
    public async getTicketById(req: Request, res: Response): Promise<void> {
        const { ticket_id } = req.params;

        try {
            const ticket = await this.ticketDAO.getTicket(Number(ticket_id));

            if (ticket) {
                res.status(200).json(ticket);
            } else {
                res.status(404).json({ error: 'Ticket not found.' });
            }
        } catch (error) {
            if (error instanceof InvalidInputError) {
                res.status(400).json({ error: 'Invalid ticket ID.' });
            } else if (error instanceof ItemNotFoundError) {
                res.status(404).json({ error: 'Ticket not found.' });
            } else {
                res.status(500).json({ error: 'Internal server error.' });
            }
        }
    }

    // GET /queue/status
    public async getQueueStatus(req: Request, res: Response): Promise<void> {
        try {
            const allTickets = await this.ticketDAO.getAllTickets();

            
            const queueStatus = allTickets.reduce((acc: any, ticket) => {
                if (!acc[ticket.service_type_id]) {
                    acc[ticket.service_type_id] = 0;
                }
                acc[ticket.service_type_id] += 1;
                return acc;
            }, {});

            res.status(200).json({ queues: queueStatus });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }

    // GET /queue/:service_id
    public async getQueueByService(req: Request, res: Response): Promise<void> {
        const { service_id } = req.params;

        try {
            const allTickets = await this.ticketDAO.getAllTickets();
            const queue = allTickets
                .filter(ticket => ticket.service_type_id === Number(service_id))
                .map(ticket => ({
                    ticket_id: ticket.ticket_id,
                    queue_position: ticket.queue_position,
                    status: ticket.status
                }));

            res.status(200).json({ service_id, queue });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }

    // PUT /ticket/:ticket_id
    public async updateTicket(req: Request, res: Response): Promise<void> {
        const { ticket_id } = req.params;
        const { queue_position, called_at, status } = req.body;

        try {
            const updatedTicket = await this.ticketDAO.updateTicket(Number(ticket_id), queue_position, called_at, status);

            if (updatedTicket) {
                res.status(200).json(updatedTicket);
            }
        } catch (error) {
            if (error instanceof InvalidInputError) {
                res.status(400).json({ error: 'Invalid input data.' });
            } else if (error instanceof ItemNotFoundError) {
                res.status(404).json({ error: 'Ticket not found.' });
            } else {
                res.status(500).json({ error: 'Internal server error.' });
            }
        }
    }

    // DELETE /ticket/:ticket_id
    public async deleteTicket(req: Request, res: Response): Promise<void> {
        const { ticket_id } = req.params;

        try {
            const success = await this.ticketDAO.deleteTicket(Number(ticket_id));

            if (success) {
                res.status(200).json({ message: 'Ticket deleted successfully.' });
            }
        } catch (error) {
            if (error instanceof ItemNotFoundError) {
                res.status(404).json({ error: 'Ticket not found.' });
            } else {
                res.status(500).json({ error: 'Internal server error.' });
            }
        }
    }
}

export default TicketController;
