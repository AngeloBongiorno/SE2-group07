const NO_NEW_TICKET = "No new TicketToShow is available";
const TICKET_NOT_FOUND = "Ticket not found";
const TICKET_ALREADY_EXISTS = "Ticket already exists in the database";

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

/**
 * Represents an error that occurs when a ticket is not found in the database.
 */
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

/**
 * Represents an error that occurs when a ticket already exists in the database.
 */
class TicketAlreadyExistsError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = TICKET_ALREADY_EXISTS;
        this.customCode = 409;
    }
}

export { NoNewTicketError, TicketNotFoundError, TicketAlreadyExistsError };