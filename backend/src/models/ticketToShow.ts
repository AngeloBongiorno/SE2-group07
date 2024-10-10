/**
 * Represents a TicketToShow, which has information of a ticket's ID/ServiceType and the counter that is serving it.
 */
class TicketToShow {
    ticketId: number;
    serviceType: number;
    counterId: number;
    called_at: Date; 

    /**
     * Creates a new instance of the TicketToShow class.
     * @param ticketId - The ticket id. This is unique for each ticket.
     * @param serviceType - Refers to the service type associated with the ticket.
     * @param counterId - The ID of the counter currently serving the ticket.
     * @param called_at - The timestamp when the ticket was called.
     */
    constructor(ticketId: number, serviceType: number, counterId: number, called_at: Date) {
        this.ticketId = ticketId;
        this.serviceType = serviceType;
        this.counterId = counterId;
        this.called_at = called_at;
    }
}

export { TicketToShow };