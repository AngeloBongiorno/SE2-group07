const NO_NEW_TICKET = "No new TicketToShow is available";
const TICKET_NOT_FOUND = "Ticket not found";

/**
 * Represents an error that occurs when no new TicketToShow is available, i.e. the ticketToShow table is empty.
 */
class NoNewTicketError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = NO_NEW_TICKET;
        this.customCode = 404;
    }
}

class TicketNotFoundError extends Error {
    customMessage: string;
    customCode: number;
    notFoundList: number[];

    constructor(notFoundList: number[]) {
        super();
        this.customMessage = TICKET_NOT_FOUND;
        this.customCode = 404;
        this.notFoundList = notFoundList;
    }
}

export { NoNewTicketError, TicketNotFoundError };