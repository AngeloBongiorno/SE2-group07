import { app } from '../../../index';
import { Database } from '../../../node_modules/sqlite3/lib/sqlite3';
import CallCustomerController from '../../controllers/CallCustomerController';
import TicketToShowDao from '../../dao/ticketToShowDao';
import db from '../../db/db';
import { dbCreate } from '../../db/db_create';
import { dbDelete } from '../../db/db_delete';
import { dbEmpty } from '../../db/db_empty';
import { dbPopulate } from '../../db/db_populate';
import { NoNewTicketError, TicketAlreadyExistsError, TicketNotFoundError } from '../../errors/callCustomerErrors';
import { WrongFormatError } from '../../errors/commonErrors';
import { ForeignKeyConstraintError, UniqueConstraintError } from '../../errors/dbErrors';
import { dayjsFromTime } from '../../helper/dayjs_helper';
import { TicketToShow } from '../../models/ticketToShow';
import dayjs from "dayjs";

import request from 'supertest';

describe('callCustomer Integration Tests', () => {
  let ticketToShowDao: TicketToShowDao;
  let callCustomerController: CallCustomerController;

  beforeAll(async () => {
    // Initialize test structures
    ticketToShowDao = new TicketToShowDao();
    callCustomerController = new CallCustomerController();

    // Delete and Create db
    await dbDelete();
    await dbCreate();
  });

  afterAll(async () => {
    // Empty db
    await dbEmpty();
    try {
      // Close db
      db.close();
      console.log("Database closed.");
    } catch (error) {
      console.error(error);
    }
  });

  beforeEach(async () => {
    // Clear db
    await dbEmpty();
  });

  describe('DAO level tests', () => {
    test('callCustomer - Normal Ticket Single Insertion and Fetching - should fetch only one ticket', async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);

      // Fetch tickets
      const tickets = await ticketToShowDao.fetchTicketsToShow();

      // Assertions
      // Type assertions
      expect(Array.isArray(tickets)).toBe(true);
      expect(tickets[0]).toBeInstanceOf(TicketToShow);

      // Result assertions
      expect(tickets.length).toBe(1);
      expect(tickets[0]).toEqual(ticket1);
    });

    test('callCustomer - Normal Ticket Multiple Insertion and Fetching - should fetch all tickets', async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      await ticketToShowDao.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at); 

      // Fetch tickets
      const tickets = await ticketToShowDao.fetchTicketsToShow();

      // Assertions
      // Type assertions
      expect(Array.isArray(tickets)).toBe(true);
      expect(tickets[0]).toBeInstanceOf(TicketToShow);
      expect(tickets[1]).toBeInstanceOf(TicketToShow);

      // Result assertions
      expect(tickets.length).toBe(2);
      expect(tickets[0]).toEqual(ticket1);
      expect(tickets[1]).toEqual(ticket2);
    });

    test("callCustomer - Error Ticket Insertion - ticket doesn't exist in ticket table", async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      // Don't populate this time

      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      // Expect ForeignKeyConstraintError
      await expect(ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at))
        .rejects
        .toThrow(ForeignKeyConstraintError);
    });

    test("callCustomer - Error Ticket Insertion - ticket already exists in ticketToShow table", async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      // Expect UniqueConstraintError
      await expect(ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at))
        .rejects
        .toThrow(UniqueConstraintError);
    });

    test('deleteTicketsToShow - Normal Deletion - should delete specified tickets', async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      await ticketToShowDao.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at);

      // Delete ticket1
      const changes = await ticketToShowDao.deleteTicketsToShow([ticket1.ticketId]);

      // Assertions
      expect(changes).toBe(1);

      // Fetch tickets
      const tickets = await ticketToShowDao.fetchTicketsToShow();

      // Result assertions
      expect(tickets.length).toBe(1);
      expect(tickets[0]).toEqual(ticket2);
    });

    test('deleteTicketsToShow - Multiple Deletion - should delete specified tickets', async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      await ticketToShowDao.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at);

      // Delete both tickets
      const changes = await ticketToShowDao.deleteTicketsToShow([ticket1.ticketId, ticket2.ticketId]);

      // Assertions
      expect(changes).toBe(2);

      // Fetch tickets
      const tickets = await ticketToShowDao.fetchTicketsToShow();

      // Result assertions
      expect(tickets.length).toBe(0);
    });

    test('deleteTicketsToShow - Error Deletion - should throw error for invalid input', async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);

      // Expect error for null input
      await expect(ticketToShowDao.deleteTicketsToShow(null as any))
        .rejects
        .toThrow(WrongFormatError);

      // Expect error for empty array
      await expect(ticketToShowDao.deleteTicketsToShow([]))
        .rejects
        .toThrow(WrongFormatError);

      // Expect error for invalid data type
      await expect(ticketToShowDao.deleteTicketsToShow([1, 'invalid' as any]))
        .rejects
        .toThrow(WrongFormatError);
    });
  });

  describe('Controller level tests', () => {
    test('callCustomer - Normal Ticket Single Insertion' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      await callCustomerController.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);

      // Fetch tickets
      const tickets = await callCustomerController.fetchTicketsToShow();

      // Assertions
      // Type assertions
      expect(Array.isArray(tickets)).toBe(true);
      expect(tickets[0]).toBeInstanceOf(TicketToShow);

      // Result assertions
      expect(tickets.length).toBe(1);
      expect(tickets[0]).toEqual(ticket1);
    });

    test('callCustomer - Normal Ticket Multiple Insertion' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
      await callCustomerController.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      await callCustomerController.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at);

      // Fetch tickets
      const tickets = await ticketToShowDao.fetchTicketsToShow();

      // Assertions
      // Type assertions
      expect(Array.isArray(tickets)).toBe(true);
      expect(tickets[0]).toBeInstanceOf(TicketToShow);
      expect(tickets[1]).toBeInstanceOf(TicketToShow);

      // Result assertions
      expect(tickets.length).toBe(2);
      expect(tickets[0]).toEqual(ticket1);
      expect(tickets[1]).toEqual(ticket2);
    });

    test("callCustomer - Error Ticket Insertion - ticket doesn't exist in ticket table", async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      // Don't populate this time

      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      // Expect ForeignKeyConstraintError
      await expect(callCustomerController.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at))
        .rejects
        .toThrow(ForeignKeyConstraintError);
    });

    test("callCustomer - Error Ticket Insertion - ticket already exists in ticketToShow table", async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      await callCustomerController.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      // Expect UniqueConstraintError
      await expect(callCustomerController.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at))
        .rejects
        .toThrow(TicketAlreadyExistsError);
    });

    test('fetchTicketsToShow' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      await ticketToShowDao.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at);

      // Fetch tickets
      const tickets = await callCustomerController.fetchTicketsToShow();

      // Assertions
      // Type assertions
      expect(Array.isArray(tickets)).toBe(true);
      expect(tickets[0]).toBeInstanceOf(TicketToShow);
      expect(tickets[1]).toBeInstanceOf(TicketToShow);

      // Result assertions
      expect(tickets.length).toBe(2);
      expect(tickets[0]).toEqual(ticket1);
      expect(tickets[1]).toEqual(ticket2);
    });

    test('fetchTicketsToShow - Error - no tickets to show' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      // Don't populate this time

      // Expect NoNewTicketError
      await expect(callCustomerController.fetchTicketsToShow())
        .rejects
        .toThrow(NoNewTicketError);
    });

    test('deleteTicketsToShow - Single Deletion' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      await ticketToShowDao.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at);

      // Delete both tickets
      await callCustomerController.deleteTicketsToShow([ticket1.ticketId, ticket2.ticketId]);

      // Fetch tickets
      const tickets = await ticketToShowDao.fetchTicketsToShow();

      // Result assertions
      expect(tickets.length).toBe(0);
    });

    test('deleteTicketsToShow - Multiple Deletion' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      await ticketToShowDao.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at);

      // Delete both tickets
      await callCustomerController.deleteTicketsToShow([ticket1.ticketId, ticket2.ticketId]);

      // Fetch tickets
      const tickets = await ticketToShowDao.fetchTicketsToShow();

      // Result assertions
      expect(tickets.length).toBe(0);
    });

    test('deleteTicketsToShow - Error Empty Table' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      // Don't populate this time

      // Expect NoNewTicketError
      await expect(callCustomerController.deleteTicketsToShow([1, 2]))
        .rejects
        .toThrow(TicketNotFoundError);
    });
  });

  describe('Route level tests', () => {
    test('callCustomer - GET / - Normal Fetching' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      await ticketToShowDao.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at);

      // Fetch tickets
      const res = await request(app).get('/officequeue/callCustomer/');

      // Convert instances to plain objects
      const expectedTickets = [
        {
          ticketId: ticket1.ticketId,
          serviceType: ticket1.serviceType,
          counterId: ticket1.counterId,
          called_at: ticket1.called_at.toISOString(),
        },
        {
          ticketId: ticket2.ticketId,
          serviceType: ticket2.serviceType,
          counterId: ticket2.counterId,
          called_at: ticket2.called_at.toISOString(),
        }
      ];

      // Assertions
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedTickets);
    });

    test('callCustomer - GET / - Error Empty Table' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      // Don't populate this time

      // Expect NoNewTicketError
      const res = await request(app).get('/officequeue/callCustomer/');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("No new TicketToShow is available");
    });

    test('callCustomer - POST / - Normal Insertion' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));

      // Insert ticket
      const res = await request(app).post('/officequeue/callCustomer/')
        .send({
          ticketId: ticket1.ticketId,
          serviceTypeId: ticket1.serviceType,
          counterId: ticket1.counterId,
          called_at: ticket1.called_at.toISOString(),
        });

      // Assertions
      expect(res.status).toBe(200);
    });

    test('callCustomer - POST / - Error Ticket Already Exists' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);

      // Insert ticket
      const res = await request(app).post('/officequeue/callCustomer/')
        .send({
          ticketId: ticket1.ticketId,
          serviceTypeId: ticket1.serviceType,
          counterId: ticket1.counterId,
          called_at: ticket1.called_at.toISOString(),
        });

      // Assertions
      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Ticket already exists in the database");
    });

    test('callCustomer - POST / - Error Foreign Key Constraint' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      // Don't populate this time

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));

      // Insert ticket
      const res = await request(app).post('/officequeue/callCustomer/')
        .send({
          ticketId: ticket1.ticketId,
          serviceTypeId: ticket1.serviceType,
          counterId: ticket1.counterId,
          called_at: ticket1.called_at.toISOString(),
        });

      // Assertions
      expect(res.status).toBe(400);
    });

    test('callCustomer - POST / - Error Wrong Format: not ISO hour' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));

      // Insert ticket
      const res = await request(app).post('/officequeue/callCustomer/')
        .send({
          ticketId: ticket1.ticketId,
          serviceTypeId: ticket1.serviceType,
          counterId: ticket1.counterId,
          called_at: "invalid",
        });

      // Assertions
      expect(res.status).toBe(422);
    });

    test('callCustomer - POST / - Error Wrong Format: missing field' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));

      // Insert ticket
      const res = await request(app).post('/officequeue/callCustomer/')
        .send({
          ticketId: ticket1.ticketId,
          serviceTypeId: ticket1.serviceType,
          counterId: ticket1.counterId,
        });

      // Assertions
      expect(res.status).toBe(422);
    });

    test('callCustomer - POST / - Error Wrong Format: ticketId not integer' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));

      // Insert ticket
      const res = await request(app).post('/officequeue/callCustomer/')
        .send({
          ticketId: "invalid",
          serviceTypeId: ticket1.serviceType,
          counterId: ticket1.counterId,
          called_at: ticket1.called_at.toISOString(),
        });

      // Assertions
      expect(res.status).toBe(422);
    });

    test('callCustomer - POST / - Error Wrong Format: serviceTypeId not integer' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));

      // Insert ticket
      const res = await request(app).post('/officequeue/callCustomer/')
        .send({
          ticketId: ticket1.ticketId,
          serviceTypeId: "invalid",
          counterId: ticket1.counterId,
          called_at: ticket1.called_at.toISOString(),
        });

      // Assertions
      expect(res.status).toBe(422);
    });

    test('callCustomer - POST / - Error Wrong Format: counterId not integer' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));

      // Insert ticket
      const res = await request(app).post('/officequeue/callCustomer/')
        .send({
          ticketId: ticket1.ticketId,
          serviceTypeId: ticket1.serviceType,
          counterId: "invalid",
          called_at: ticket1.called_at.toISOString(),
        });

      // Assertions
      expect(res.status).toBe(422);
    });

    test('callCustomer - DELETE / - Normal Deletion' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Insert test data
      const ticket1 = new TicketToShow(1, 1, 1, dayjsFromTime("10:00:01"));
      const ticket2 = new TicketToShow(2, 2, 2, dayjsFromTime("10:00:02"));
      await ticketToShowDao.insertTicketToShow(ticket1.ticketId, ticket1.serviceType, ticket1.counterId, ticket1.called_at);
      await ticketToShowDao.insertTicketToShow(ticket2.ticketId, ticket2.serviceType, ticket2.counterId, ticket2.called_at);

      // Delete tickets
      const res = await request(app).delete('/officequeue/callCustomer/')
        .send([ticket1.ticketId, ticket2.ticketId]);

      // Assertions
      expect(res.status).toBe(200);
    });

    test('callCustomer - DELETE / - Error Empty Table' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      // Don't populate this time

      // Delete tickets
      const res = await request(app).delete('/officequeue/callCustomer/')
        .send([1, 2]);

      // Assertions
      expect(res.status).toBe(404);
    });

    test('callCustomer - DELETE / - Error Wrong Format: not an array' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Delete tickets
      const res = await request(app).delete('/officequeue/callCustomer/')
        .send('1');

      // Assertions
      expect(res.status).toBe(422);
    });

    test('callCustomer - DELETE / - Error Wrong Format: not an array of integers' , async () => {
      // Delete and Create db
      await dbDelete();
      await dbCreate();
      await dbPopulate();

      // Delete tickets
      const res = await request(app).delete('/officequeue/callCustomer/')
        .send([1, 'invalid']);

      // Assertions
      expect(res.status).toBe(422);
    });
  });
});