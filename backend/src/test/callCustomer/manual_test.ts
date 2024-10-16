import dayjs from "dayjs";
import { TicketToShow } from "../../models/ticketToShow";
import TicketToShowDao from "../../dao/ticketToShowDao";
import { dbDelete } from "../../db/db_delete";
import { dbCreate } from "../../db/db_create";
import request from 'supertest';   

import db from '../../db/db';
import { dayjsFromTime } from "../../helper/dayjs_helper";
import { dbPopulate } from "../../db/db_populate";
import { app } from "../../../index";
import { list } from "pdfkit";

const ticketToShowDao = new TicketToShowDao();

function listRoutes() {
    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) { // Routes registered directly on the app
            console.log(middleware.route.path);
        } else if (middleware.name === 'router') { // Router middleware
            middleware.handle.stack.forEach((handler: any) => {
                if (handler.route) {
                    console.log(handler.route.path);
                }
            });
        }
    });
}

// async function manual_test() {
//     try {
//         // Delete and Create db
//         await dbDelete();
//         await dbCreate();
//         await dbPopulate();

//         // Insert test data
//         const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
//         const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
//         await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
//         await ticketToShowDao.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at);

//         // Fetch tickets
//         const res = await request(app).get('/officequeue/callCustomer/');

//         // Assertions
//         expect(res.status).toBe(200);
//         expect(res.body).toEqual([ticket1, ticket2]);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         db.close((err: any) => {
//             if (err) {
//                 console.error('Error while closing the database:', err.message);
//             } else {
//                 console.log('Database connection closed.');
//             }
//         });
//     }
// }

listRoutes();
// manual_test();

