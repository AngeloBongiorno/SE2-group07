import dayjs from "dayjs";
import db from "../db/db";
import { TicketToShow } from "../models/ticketToShow";
import { ForeignKeyConstraintError, UniqueConstraintError } from "../errors/dbErrors";

class TicketToShowDAO {
    /**
     * Fetches all tickets to show from the database.
     * @returns {Promise<TicketToShow[]>} A promise that resolves to an array of TicketToShow objects.
     */
    public fetchTicketsToShow(): Promise<TicketToShow[]> {
        return new Promise<TicketToShow[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM TicketsToShow;";
                db.all(sql, [], (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const ticketsToShow: TicketToShow[] = rows.map(row => new TicketToShow(
                        row.ticket_id,
                        row.service_type_id,
                        row.counter_id,
                        dayjs(row.called_at).toDate()
                    ));
                    resolve(ticketsToShow);
                    return;
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Inserts a new ticket to show into the database.
     * @param {number} ticket_id - The ID of the ticket.
     * @param {number} service_type_id - The ID of the service type.
     * @param {number} counter_id - The ID of the counter.
     * @param {Date} called_at - The time the ticket was called for service.
     * @returns {Promise<void>} A promise that resolves when the ticket is inserted.
     */
    public insertTicketToShow(ticket_id: number, service_type_id: number, counter_id: number, called_at: Date): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                // Check for null or undefined values
                if (ticket_id == null || service_type_id == null || counter_id == null || called_at == null) {
                    reject(new Error("Invalid input: One or more input parameters are null or undefined."));
                    return;
                }

                // Check for valid data types
                if (typeof ticket_id !== 'number' || typeof service_type_id !== 'number' || typeof counter_id !== 'number' || !(called_at instanceof Date)) {
                    reject(new Error("Invalid input: One or more input parameters have incorrect data types."));
                    return;
                }

                // Insert the ticket
                const sql = "INSERT INTO TicketsToShow (ticket_id, service_type_id, counter_id, called_at) VALUES (?, ?, ?, ?);";
                db.run(sql, [ticket_id, service_type_id, counter_id, dayjs(called_at).toISOString()], (err: Error | null) => {
                    if (err) {
                        if (err.message.includes("FOREIGN KEY constraint failed")) {
                            reject(new ForeignKeyConstraintError);
                        } else if (err.message.includes("UNIQUE constraint failed")) {
                            reject(new UniqueConstraintError);
                        } else {
                            reject(err);
                        }
                        return;
                    }
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Deletes tickets to show from the database based on the provided ticket IDs.
     * @param {number[]} ticket_ids - An array of ticket IDs to delete.
     * @returns {Promise<void>} A promise that resolves when the tickets are deleted.
     */
    public deleteTicketsToShow(ticket_ids: number[]): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try {
                // Check for null or undefined values
                if (ticket_ids == null || ticket_ids.some(id => id == null)) {
                    reject(new Error("Invalid input: One or more input parameters are null or undefined."));
                    return;
                }

                // Check for empty arrays
                if (ticket_ids.length === 0) {
                    reject(new Error("Invalid input: The input array is empty."));
                    return;
                }

                // Check for valid data types
                if (!Array.isArray(ticket_ids) || ticket_ids.some(id => typeof id !== 'number')) {
                    reject(new Error("Invalid input: One or more input parameters have incorrect data types."));
                    return;
                }

                // Delete the tickets
                const sql = `DELETE FROM TicketsToShow WHERE ticket_id IN (${ticket_ids.join(", ")});`;
                db.run(sql, [], function (err: Error | null) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.changes);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default TicketToShowDAO;