import express from "express"
import CallCustomerRoutes from "./routes/callCustomerRoutes"
import ErrorHandler from "./routes/helper"
const morgan = require("morgan")

const prefix = "/officequeue"

/**
 * Initializes the routes for the application.
 */
function initRoutes(app: express.Application) {
    app.use(morgan("dev")) // Log requests to the console
    app.use(express.json({ limit: "25mb" }))
    app.use(express.urlencoded({ limit: '25mb', extended: true }))

    const callCustomerRoutes = new CallCustomerRoutes()

    // static route that allows access to ticket pdfs
    app.use(`${prefix}/ticketPdfs`, express.static("./ticketPdfs"));

    app.use(`${prefix}/callCustomer`, callCustomerRoutes.getRouter())

    ErrorHandler.registerErrorHandler(app)
}

export default initRoutes
