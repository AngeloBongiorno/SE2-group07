import { test, expect, jest, describe, afterAll, afterEach, beforeAll, beforeEach} from "@jest/globals"
import { cleanup } from "../db/cleanup";
import request from 'supertest';
import db, { asyncdb } from "../db/db";
import { app } from "../..";

const URL = "/officequeue";


beforeAll(async () => {
    await cleanup();
    await asyncdb.asyncRun("INSERT INTO ServiceTypes (service_type_id, name, avg_service_time) VALUES (1,'account managing',10)")
    await asyncdb.asyncRun("INSERT INTO ServiceTypes (service_type_id, name, avg_service_time) VALUES (2,'product managing',20)")
    await asyncdb.asyncRun("INSERT INTO ServiceTypes (service_type_id, name, avg_service_time) VALUES (3,'sales managing',15)")
    await asyncdb.asyncRun("INSERT INTO Counters (counter_id, name) VALUES (1,'prova1')")
    await asyncdb.asyncRun("INSERT INTO Counters (counter_id, name) VALUES (2,'prova2')")
    await asyncdb.asyncRun("INSERT INTO CounterServices (counter_service_id, counter_id, service_type_id) VALUES (1,1,1)")
    await asyncdb.asyncRun("INSERT INTO CounterServices (counter_service_id, counter_id, service_type_id) VALUES (3,1,2)")
    await asyncdb.asyncRun("INSERT INTO CounterServices (counter_service_id, counter_id, service_type_id) VALUES (2,2,1)")
    await asyncdb.asyncRun("INSERT INTO Tickets (ticket_id, service_type_id, queue_position, issued_at, called_at, status) VALUES(1,1,1,datetime('now'),NULL,'waiting');")
    await asyncdb.asyncRun("INSERT INTO Tickets (ticket_id, service_type_id, queue_position, issued_at, called_at, status) VALUES(2,1,2,datetime('now'),NULL,'waiting');")
    await asyncdb.asyncRun("INSERT INTO Tickets (ticket_id, service_type_id, queue_position, issued_at, called_at, status) VALUES(3,2,3,datetime('now'),NULL,'waiting');")
})

afterAll(async () => {
    await cleanup();
    await asyncdb.close();
})

describe("next customer with two queues", () => {
    test("select the longest queue", async () => {
        let counter_id = 1;
        const response = await request(app).post(`${URL}/nextCustomer`).send({"counter_id": counter_id});
        expect(response.status).toBe(200);
        expect(response.body.ticket_id).toBe(1);
        expect(response.body.status).toBe('called');
    });
    test("select the queue with shortest service time", async () => {
        let counter_id = 1;
        await cleanup();
        await asyncdb.asyncRun("INSERT INTO ServiceTypes (service_type_id, name, avg_service_time) VALUES (1,'account managing',10)")
        await asyncdb.asyncRun("INSERT INTO ServiceTypes (service_type_id, name, avg_service_time) VALUES (2,'product managing',20)")
        await asyncdb.asyncRun("INSERT INTO Counters (counter_id, name) VALUES (1,'prova1')")
        await asyncdb.asyncRun("INSERT INTO CounterServices (counter_service_id, counter_id, service_type_id) VALUES (1,1,1)")
        await asyncdb.asyncRun("INSERT INTO CounterServices (counter_service_id, counter_id, service_type_id) VALUES (3,1,2)")
        await asyncdb.asyncRun("INSERT INTO Tickets (ticket_id, service_type_id, queue_position, issued_at, called_at, status) VALUES(1,1,1,datetime('now'),NULL,'waiting');")
        await asyncdb.asyncRun("INSERT INTO Tickets (ticket_id, service_type_id, queue_position, issued_at, called_at, status) VALUES(2,2,2,datetime('now'),NULL,'waiting');")

        const response = await request(app).post(`${URL}/nextCustomer`).send({"counter_id": counter_id});
        expect(response.status).toBe(200);
        console.log(response.body);
        expect(response.body.ticket_id).toBe(1);
        expect(response.body.status).toBe('called');
    });
    
    
})