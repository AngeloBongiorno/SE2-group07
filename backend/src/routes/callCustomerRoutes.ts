import express, { Router } from "express"
import ErrorHandler from "./helper"
import CallCustomerController from "../controllers/CallCustomerController"
import { NoNewTicketError } from "../errors/callCustomerErrors";
import { body, param } from "express-validator"
import { TicketToShow } from "../models/ticketToShow";
import { dayjsFromTime } from "../helper/dayjs_helper";

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
            (req: any, res: any, next: any) => this.controller.fetchTicketsToShow()
                .then((tickets: TicketToShow[]) => res.status(200).json(tickets))
                .catch((err) => {
                    next(err)
                })
        );

        /**
         * Route for deleting the TicketToShow objects based on ticket IDs.
         */
        this.router.delete(
            '/',
            body().isArray().withMessage('Request body must be an array of ticket IDs'),
            body('*').isInt().withMessage('Each ticket ID must be an integer'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.deleteTicketsToShow(req.body)
                .then(() => res.status(200).end())
                .catch((err) => {
                    next(err)
                })
        );

        /**
         * Route for inserting a new TicketToShow object.
         */
        this.router.post(
            '/',
            body('ticketId').isInt().withMessage('ticketId must be an integer'),
            body('serviceTypeId').isInt().withMessage('serviceTypeId must be an integer'),
            body('counterId').isInt().withMessage('counterId must be an integer'),
            body('called_at').isISO8601().withMessage('called_at must be a valid ISO 8601 date'),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.insertTicketToShow(
                req.body.ticketId,
                req.body.serviceTypeId,
                req.body.counterId,
                dayjsFromTime(req.body.called_at)
            )   
                .then(() => res.status(200).end())
                .catch((err) => {
                    next(err)
                })
        );
    }
}

export default CallCustomerRoutes;