/**
 * Represents a Ticket
 */
class Ticket {
    ticket_id: number;
    service_type_id: number;
    queue_position: number;
    issued_at: Date;
    called_at: Date | null;
    status: Status;

    /**
     * Creates a new instance of the Ticket class.
     * @param ticket_id - The ticket id. This is unique for each ticket.
     * @param service_type_id - refers to the service type associated to the ticket
     * @param queue_position: where the ticket stands in its queue_position
     * @param issued_at - the ticket was issued at this time
     * @param called_at - the ticket was called at this time
     * @param status - can be either waiting, called or served
     */
    constructor(ticket_id: number, service_type_id: number, queue_position: number, issued_at: Date, called_at: Date | null, status: Status) {
        this.ticket_id = ticket_id;
        this.service_type_id = service_type_id;
        this.queue_position = queue_position;
        this.issued_at = issued_at;
        this.called_at = called_at;
        this.status = status;
    }
}

/**
 * Represents the status of a ticket.
 * The values present in this enum are the only valid values for the status of a ticket
 */
enum Status {
    WAITING = "waiting",
    CALLED = "called",
    SERVED = "served"
}

export { Ticket, Status }
