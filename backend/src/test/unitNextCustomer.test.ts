import { test, expect, jest, describe, afterEach } from "@jest/globals";
import TicketDAO from "../dao/TicketDao";
import { asyncdb } from "../db/db";
import NextCustomerController from "../controllers/NextCustomerController";
import CounterServiceDAO from "../dao/counterServiceDao";
import { ServiceType } from "../models/ServiceType";
import { Status, Ticket } from "../models/Ticket";

jest.mock("../db/db");

afterEach(() => {
    jest.clearAllMocks();
});

describe("TicketDAO", () => {
    describe("getQueueLength", () => {
        test("", async () => {
            const ticketDAO = new TicketDAO();
            jest.spyOn(asyncdb,"asyncGet").mockResolvedValue({ count: 1 });
            await expect(ticketDAO.getQueuesLength(1)).resolves.toEqual(1);
            expect(asyncdb.asyncGet).toHaveBeenCalledWith("SELECT COUNT(*) as count FROM Tickets WHERE service_type_id=? AND status='waiting'",[1])
        })
    })
    describe("getFirstTicket", () => {
        test("", async () => {
            const ticketDAO = new TicketDAO();
            jest.spyOn(asyncdb,"asyncGet").mockResolvedValue({ticket_id:1});
            await expect(ticketDAO.getFirstTicket(1)).resolves.toEqual(1);
            expect(asyncdb.asyncGet).toHaveBeenCalledWith("SELECT ticket_id FROM Tickets WHERE status='waiting' AND service_type_id=? ORDER BY issued_at ASC LIMIT 1",[1])
        })
        test("service_type_id doesn't exist", async () => {
            const ticketDAO = new TicketDAO();
            jest.spyOn(asyncdb,"asyncGet").mockResolvedValue([]);
            await expect(ticketDAO.getFirstTicket(1)).rejects;
            expect(asyncdb.asyncGet).toHaveBeenCalledWith("SELECT ticket_id FROM Tickets WHERE status='waiting' AND service_type_id=? ORDER BY issued_at ASC LIMIT 1",[1])
        })
    })
    describe("setTicketAsCalled", () => {
        test("", async () => {
            const ticketDAO = new TicketDAO();
            jest.spyOn(asyncdb,"asyncRun")
            await ticketDAO.setTicketAsCalled(1)
            expect(asyncdb.asyncRun).toHaveBeenCalledWith("UPDATE Tickets SET called_at=datetime('now'),status='called' WHERE ticket_id=?",[1])
        })
    })

})

describe("nextCustomerController",() => {
    test("one queue", async() => {
        const nextCustomerController = new NextCustomerController;
        let test: ServiceType[] = [{
            service_type_id: 1,
            name: "prova",
            avg_service_time: 15
        }];
        let res: Ticket = {
            ticket_id: 1,
            service_type_id: 1,
            queue_position: 1,
            issued_at: new Date(),
            called_at: new Date(),
             status: Status.CALLED
        }
        jest.spyOn(CounterServiceDAO.prototype,"getServices").mockResolvedValueOnce(test);
        jest.spyOn(TicketDAO.prototype,"getQueuesLength").mockResolvedValueOnce(1);
        jest.spyOn(TicketDAO.prototype,"getFirstTicket").mockResolvedValueOnce(1);
        jest.spyOn(TicketDAO.prototype,"setTicketAsCalled").mockResolvedValueOnce(res);
        await expect(nextCustomerController.NextCustomer(1)).resolves.toEqual(res);
        expect(CounterServiceDAO.prototype.getServices).toHaveBeenCalledTimes(1);
        expect(CounterServiceDAO.prototype.getServices).toHaveBeenCalledWith(1);
        expect(TicketDAO.prototype.getQueuesLength).toHaveBeenCalledTimes(1);
        expect(TicketDAO.prototype.getQueuesLength).toHaveBeenCalledWith(1);
        expect(TicketDAO.prototype.getFirstTicket).toHaveBeenCalledTimes(1);
        expect(TicketDAO.prototype.getFirstTicket).toHaveBeenCalledWith(1);
        expect(TicketDAO.prototype.setTicketAsCalled).toHaveBeenCalledTimes(1);
        expect(TicketDAO.prototype.setTicketAsCalled).toHaveBeenCalledWith(1);
    })
    test("two queues, same length", async() => {
        const nextCustomerController = new NextCustomerController;
        let test: ServiceType[] = [{
            service_type_id: 1,
            name: "prova",
            avg_service_time: 15
        },{
            service_type_id: 2,
            name: "provaaaaaa",
            avg_service_time: 25
        }];
        let res: Ticket = {
            ticket_id: 1,
            service_type_id: 1,
            queue_position: 1,
            issued_at: new Date(),
            called_at: new Date(),
             status: Status.CALLED
        }
        jest.spyOn(CounterServiceDAO.prototype,"getServices").mockResolvedValueOnce(test);
        jest.spyOn(TicketDAO.prototype,"getQueuesLength").mockResolvedValue(1);
        jest.spyOn(TicketDAO.prototype,"getFirstTicket").mockResolvedValueOnce(1);
        jest.spyOn(TicketDAO.prototype,"setTicketAsCalled").mockResolvedValueOnce(res);
        await expect(nextCustomerController.NextCustomer(1)).resolves.toEqual(res);
        expect(CounterServiceDAO.prototype.getServices).toHaveBeenCalledTimes(1);
        expect(CounterServiceDAO.prototype.getServices).toHaveBeenCalledWith(1);
        expect(TicketDAO.prototype.getQueuesLength).toHaveBeenCalledTimes(2);
        expect(TicketDAO.prototype.getQueuesLength).toHaveBeenCalledWith(1);
        expect(TicketDAO.prototype.getFirstTicket).toHaveBeenCalledTimes(1);
        expect(TicketDAO.prototype.getFirstTicket).toHaveBeenCalledWith(1);
        expect(TicketDAO.prototype.setTicketAsCalled).toHaveBeenCalledTimes(1);
        expect(TicketDAO.prototype.setTicketAsCalled).toHaveBeenCalledWith(1);
    })
    test("no tckets", async() => {
        const nextCustomerController = new NextCustomerController;
        let test: ServiceType[] = [{
            service_type_id: 1,
            name: "prova",
            avg_service_time: 15
        }];
        let res: Ticket = {
            ticket_id: 1,
            service_type_id: 1,
            queue_position: 1,
            issued_at: new Date(),
            called_at: new Date(),
             status: Status.CALLED
        }
        jest.spyOn(CounterServiceDAO.prototype,"getServices").mockResolvedValueOnce(test);
        jest.spyOn(TicketDAO.prototype,"getQueuesLength").mockResolvedValueOnce(0);
        jest.spyOn(TicketDAO.prototype,"getFirstTicket").mockResolvedValueOnce(1);
        jest.spyOn(TicketDAO.prototype,"setTicketAsCalled").mockResolvedValueOnce(res);
        await expect(nextCustomerController.NextCustomer(1)).resolves.toEqual(null);
        expect(CounterServiceDAO.prototype.getServices).toHaveBeenCalledTimes(1);
        expect(CounterServiceDAO.prototype.getServices).toHaveBeenCalledWith(1);
        expect(TicketDAO.prototype.getQueuesLength).toHaveBeenCalledTimes(1);
        expect(TicketDAO.prototype.getQueuesLength).toHaveBeenCalledWith(1);
        expect(TicketDAO.prototype.getFirstTicket).not.toHaveBeenCalled;
        expect(TicketDAO.prototype.setTicketAsCalled).not.toHaveBeenCalled;
    })
})