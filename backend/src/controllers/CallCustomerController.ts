import { Dayjs } from 'dayjs';
import TicketToShowDAO from '../dao/ticketToShowDao';
import { NoNewTicketError, TicketAlreadyExistsError, TicketNotFoundError } from '../errors/callCustomerErrors';
import { ForeignKeyConstraintError, UniqueConstraintError } from '../errors/dbErrors';
import { TicketToShow } from '../models/ticketToShow';
import { GenericError } from '../errors/commonErrors';

/**
 * Represents a controller for managing tickets to show.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class CallCustomerController {
    private dao: TicketToShowDAO;

    constructor() {
        this.dao = new TicketToShowDAO();
    }

    /**
     * Inserts a new ticket to show into the database.
     * @param {number} ticket_id - The ID of the ticket.
     * @param {number} service_type_id - The ID of the service type.
     * @param {number} counter_id - The ID of the counter.
     * @param {Date} called_at - The time the ticket was called for service.
     * @returns {Promise<void>} A promise that resolves when the ticket is inserted.
     * @throws {TicketAlreadyExistsError} If the ticket already exists in the database.
     * @throws {ForeignKeyConstraintError} If there is a foreign key constraint violation.
     * @throws {Error} If there is any other error inserting the ticket.
     */
    async insertTicketToShow(ticket_id: number, service_type_id: number, counter_id: number, called_at: Dayjs): Promise<void> {
        try {
            await this.dao.insertTicketToShow(ticket_id, service_type_id, counter_id, called_at);
        } catch (error:any ) {
            if (error instanceof UniqueConstraintError) {
                throw new TicketAlreadyExistsError();
            } else if (error instanceof ForeignKeyConstraintError) {
                throw new ForeignKeyConstraintError();
            } else {
                throw new GenericError(error.message);
            }
        }
    }

    /**
     * Fetches all tickets to show from the database.
     * @returns {Promise<TicketToShow[]>} A promise that resolves to an array of TicketToShow objects.
     * @throws {NoNewTicketError} If no new TicketToShow is available (i.e., the ticketToShow table is empty).
     * @throws {Error} If there is an error fetching the tickets from the database.
     */
    async fetchTicketsToShow(): Promise<TicketToShow[]> {
        try {
            const ticketsToShow = await this.dao.fetchTicketsToShow();
            if (ticketsToShow.length === 0) {
                throw new NoNewTicketError();
            } else {
                return ticketsToShow;
            }
        } catch (error: any) {
            if (error instanceof NoNewTicketError) {
                throw new NoNewTicketError();
            } else {
                throw new GenericError(error.message);
            }
        }
    }

    /**
     * Deletes tickets to show from the database based on the provided ticket IDs.
     * @param {number[]} ticket_ids - An array of ticket IDs to delete.
     * @returns {Promise<void>} A promise that resolves when the tickets are deleted.
     * @throws {TicketNotFoundError} If no tickets were deleted (i.e., the provided ticket IDs were not found).
     * @throws {Error} If there is an error deleting the tickets from the database.
     */
    async deleteTicketsToShow(ticket_ids: number[]): Promise<void> {
        try {
            const nof_deleted_tickets = await this.dao.deleteTicketsToShow(ticket_ids);
            if (nof_deleted_tickets === 0) {
                throw new TicketNotFoundError(ticket_ids);
            }
        } catch (error: any) {
            if (error instanceof TicketNotFoundError) {
                throw new TicketNotFoundError(ticket_ids);
            } else {
            throw new GenericError(error.message);
            }
        }
    }
}

export default CallCustomerController;