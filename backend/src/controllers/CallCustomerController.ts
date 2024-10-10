import TicketToShowDAO from '../dao/ticketToShowDao'

/**
 * Represents a controller for managing shopping carts.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class CallCustomerController {
    private dao: TicketToShowDAO

    constructor() {
        this.dao = new TicketToShowDAO;
    }
}

export default CallCustomerController