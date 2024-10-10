import express, { Router } from "express"
import ErrorHandler from "./helper"
import CallCustomerController from "../controllers/CallCustomerController"

/**
 * Represents a class that defines the routes for handling the call of customers,
 * i.e. the display of the next customer at a counter on the waiting display.
 */
class CallCustomerRoutes {
    private controller: CallCustomerController;
    private router: Router;
    private errorHandler: ErrorHandler;

    /**
     * Constructs a new instance of the CallCustomerRoutes class.
     */
    constructor() {
        this.controller = new CallCustomerController();
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    /**
     * Returns the router instance.
     * @returns The router instance.
     */
    getRouter(): Router {
        return this.router;
    }

    /**
     * Initializes the routes for the CallCustomer Router.
     * 
     * @remarks
     * Applies validation middlewares to protect the routes.
     */
    initRoutes() {
        /**
         * Route for getting the TicketToShow objects from the tickets not yet shown.
         */
        this.router.get(
            '/',
            // TODO
        )

        this.router.delete(
            '/',
            // TODO
        )
    }
}

export default CallCustomerRoutes;