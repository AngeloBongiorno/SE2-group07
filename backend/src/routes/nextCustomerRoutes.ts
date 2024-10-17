import express, { Router } from "express";
import ErrorHandler from "./helper";
import NextCustomerController from "../controllers/NextCustomerController";
import { Ticket } from "../models/Ticket";


class NextCustomerRoutes {
    private controller: NextCustomerController;
    private router: Router;
    private errorHandler: ErrorHandler;

    constructor() {
        console.log("Initializing NextCustomerRoutes...");
        this.controller = new NextCustomerController();
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
        this.router.post(
            '/nextCustomer',
            (req: any, res: any, next: any) => {
                let counter_id = req.body.counter_id;
                if(typeof counter_id === 'number' && counter_id > 0){
                    this.controller.NextCustomer(counter_id)
                    .then((ticket: Ticket | null) => {
                        if (ticket) {
                            return res.status(200).json(ticket);
                        } else{
                            return res.status(200).end();
                        }})
                    .catch((err) => {
                        console.error(err);
                        return res.status(500).json({ error: "Internal server error" });
                    });
                }
                else{
                    return res.status(400).json({ error: "Invalid counter_id" });
                }
                
            } 
        )

    }
}

export default NextCustomerRoutes;