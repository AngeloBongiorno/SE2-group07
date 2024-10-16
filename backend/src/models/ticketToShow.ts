import dayjs, { Dayjs } from 'dayjs';

class TicketToShow {
    ticketId: number;
    serviceType: number;
    counterId: number;
    called_at: Dayjs;

    /**
     * Creates a new instance of the TicketToShow class.
     * @param ticketId - The ticket id. This is unique for each ticket.
     * @param serviceType - Refers to the service type associated with the ticket.
     * @param counterId - The ID of the counter currently serving the ticket.
     * @param called_at - The timestamp when the ticket was called.
     */
    constructor(ticketId: number, serviceType: number, counterId: number, called_at: Dayjs) {
        this.ticketId = ticketId;
        this.serviceType = serviceType;
        this.counterId = counterId;
        this.called_at = called_at;
    }

    /**
     * Returns a string representation of the TicketToShow instance.
     * @returns {string} A string representation of the TicketToShow instance.
     */
    toString(): string {
        return `TicketToShow {
                    ticketId: ${this.ticketId},
                    serviceType: ${this.serviceType},
                    counterId: ${this.counterId},
                    called_at: ${this.called_at.format('HH:mm:ss')}
                }`;
    }
}

export { TicketToShow };