// import db from "../db/db";
// import { Ticket, Status } from "../models/Ticket"
// import { InvalidInputError, ItemAlreadyExistsError, ItemNotFoundError } from "./errors";
// import dayjs from "dayjs";



// class TicketDAO {
//   public createTicket(service_type_id: number, queue_position: number, issued_at: Date | null ): Promise<boolean> {
//         return new Promise<boolean>((resolve, reject) => {
//             try {
//                 if (service_type_id < 0 || queue_position < 0){
//                     reject(new InvalidInputError());
//                     return;
//                 }
//                 let sql: string;
//                 let inputs: any[];
//                 if (issued_at === null) {
//                   sql = "INSERT INTO Tickets(service_type_id, queue_position) VALUES(?, ?)";
//                   inputs = [service_type_id, queue_position];
//                 } else {
//                   const formatted_issued_at = dayjs(issued_at).toISOString();
//                   sql = "INSERT INTO Tickets(service_type_id, queue_position, issued_at) VALUES(?, ?, ?)";
//                   inputs = [service_type_id, queue_position, formatted_issued_at];
//                 }
//                 db.run(sql, inputs, (err: Error | null) => {
//                     if (err) {
//                         if (err.message.includes("UNIQUE constraint failed: Tickets.ticket_id")) reject(new ItemAlreadyExistsError());
//                         reject(err);
//                         return;
//                     }
//                     resolve(true);
//                     return;
//                 })
//             } catch (error) {
//                 reject(error);
//             }

//         })
//     }

//     public getAllTickets(): Promise<Ticket[]> {
//         return new Promise<Ticket[]>((resolve, reject) => {
//             try {
//                 const sql = "SELECT * FROM Tickets;"
//                 db.all(sql, [], (err: Error | null, rows: any[]) => {
//                     if (err) {
//                         reject(err);
//                         return;
//                     }
//                     const tickets: Ticket[] = rows.map(row => new Ticket(row.ticket_id,
//                                                                         row.service_type_id,row.queue_position,
//                                                                         dayjs(row.issued_at).toDate(),
//                                                                         row.called_at ? dayjs(row.called_at).toDate() : null,
//                                                                         row.status));
//                     resolve(tickets);
//                     return;
//                 })
//             } catch (error) {
//                 reject(error);
//             }

//         })
//     }

//     public getTicket(ticket_id: number): Promise<Ticket> {
//         return new Promise<Ticket>((resolve, reject) => {
//             try {
//                 if (ticket_id < 0) {
//                     reject(new InvalidInputError());
//                     return;
//                 }
//                 const sql = "SELECT * FROM Tickets WHERE ticket_id = ?;"
//                 db.get(sql, [ticket_id], (err: Error | null, row: any) => {
//                     if (err) {
//                         if (err.message.includes("UNIQUE constraint failed: Tickets.ticket_id")) {
//                           reject(new ItemAlreadyExistsError());
//                         } else {
//                           reject(err);
//                         }
//                         return;
//                     }
//                     if (!row) {
//                       reject(new ItemNotFoundError());
//                       return;
//                     }
//                     const ticket: Ticket = new Ticket (row.ticket_id,
//                                                       row.service_type_id,
//                                                       row.queue_position,
//                                                       row.issued_at,
//                                                       row.called_at,
//                                                       row.status);
//                     resolve(ticket);
//                     return;
//                 })
//             } catch (error) {
//                 reject(error);
//             }

//         })
//     }

//     deleteTicket(ticket_id: number): Promise<Boolean> {
//             return new Promise<Boolean>((resolve, reject) => {
//                 const sql = "DELETE FROM Tickets WHERE ticket_id=?"
//                 db.run(sql, [ticket_id], function(err: Error | null){
//                     if(err){
//                         reject(err)
//                         return
//                     }
//                       if(this.changes === 0){
//                           reject(new ItemNotFoundError());
//                           return;
//                       }
//                       resolve(true);
//                       return;
//                   })
//               })
//     }

//     deleteTicket(ticket_id: number): Promise<Boolean> {
//             return new Promise<Boolean>((resolve, reject) => {
//                 const sql = "DELETE FROM Tickets WHERE ticket_id=?"
//                 db.run(sql, [ticket_id], function(err: Error | null){
//                     if(err){
//                         reject(err)
//                         return
//                     }
//                       if(this.changes === 0){
//                           reject(new ItemNotFoundError());
//                           return;
//                       }
//                       resolve(true);
//                       return;
//                   })
//               })
//     }


//     updateTicket(ticket_id: number, queue_position?: number, called_at?: Date, status?: Status): Promise<Ticket>{
//       return new Promise<Ticket>((resolve, reject) =>{
//         let sqlUpdate = "UPDATE Tickets SET";
//         const updates: string[] = [];
//         const values: (Status | number | string | null)[] = [];

//         if (called_at) {
//                 const formatted_called_at = dayjs(called_at).toISOString();
//                 updates.push(" called_at = ?");
//                 values.push(formatted_called_at);
//         } 
//         if (status) {
//                updates.push(" status = ?");
//                 values.push(status);
//         }
//         if (queue_position !== undefined) {
//                 updates.push(" queue_position = ?");
//                 values.push(queue_position);
//         }

//         if (updates.length === 0) {
//               reject(new InvalidInputError());
//               return;
//         }

//         sqlUpdate += updates.join(", ") + " WHERE ticket_id = ?";
//         values.push(ticket_id); // Add ticket_id to the parameters

//         db.run(sqlUpdate, values, (err: Error | null) => {
//             if (err) {
//                 reject(err)
//                 return;
//             }
//             const sqlGet = "SELECT * FROM Tickets WHERE ticket_id = ?"
//             db.get(sqlGet, [ticket_id], (err: Error | null, row: any) => {
//                 if (err) {
//                     reject(err)
//                     return;
//                 }   
//                 if(!row){
//                     reject(new ItemNotFoundError())
//                     return;
//                 }
//                 const ticket: Ticket = new Ticket(row.ticket_id, row.service_type_id, row.queue_position, dayjs(row.issued_at).toDate(),
//                                                   row.called_at ? dayjs(row.called_at).toDate() : null,
//                                                   row.status);
//                 resolve(ticket);
//             });
//         });
//      })
//     }
// }

// export default TicketDAO;



// import db from "../db/db";
// import { Ticket, Status } from "../models/Ticket";
// import { InvalidInputError, ItemAlreadyExistsError, ItemNotFoundError } from "./errors";
// import dayjs from "dayjs";

//     updateTicket(ticket_id: number, queue_position?: number, called_at?: Date, status?: Status): Promise<Ticket>{
//       return new Promise<Ticket>((resolve, reject) =>{
//         let sqlUpdate = "UPDATE Tickets SET";
//         const updates: string[] = [];
//         const values: (Status | number | string | null)[] = [];

//         if (called_at) {
//                 const formatted_called_at = dayjs(called_at).toISOString();
//                 updates.push(" called_at = ?");
//                 values.push(formatted_called_at);
//         } 
//         if (status) {
//                updates.push(" status = ?");
//                 values.push(status);
//         }
//         if (queue_position !== undefined) {
//                 updates.push(" queue_position = ?");
//                 values.push(queue_position);
//         }

//         if (updates.length === 0) {
//               reject(new InvalidInputError());
//               return;
//         }

//         sqlUpdate += updates.join(", ") + " WHERE ticket_id = ?";
//         values.push(ticket_id); // Add ticket_id to the parameters

//         db.run(sqlUpdate, values, (err: Error | null) => {
//             if (err) {
//                 reject(err)
//                 return;
//             }
//             const sqlGet = "SELECT * FROM Tickets WHERE ticket_id = ?"
//             db.get(sqlGet, [ticket_id], (err: Error | null, row: any) => {
//                 if (err) {
//                     reject(err)
//                     return;
//                 }   
//                 if(!row){
//                     reject(new ItemNotFoundError())
//                     return;
//                 }
//                 const ticket: Ticket = new Ticket(row.ticket_id, row.service_type_id, row.queue_position, dayjs(row.issued_at).toDate(),
//                                                   row.called_at ? dayjs(row.called_at).toDate() : null,
//                                                   row.status);
//                 resolve(ticket);
//             });
//         });
//      })
//     }
// }

// export default TicketDAO;



import db from "../db/db";
import { Ticket, Status } from "../models/Ticket";
import { InvalidInputError, ItemAlreadyExistsError, ItemNotFoundError } from "./errors";
import dayjs from "dayjs";

class TicketDAO {

    private fetchTicketById(ticket_id: number): Promise<Ticket> {
        return new Promise<Ticket>((resolve, reject) => {
            const sqlGet = "SELECT * FROM Tickets WHERE ticket_id = ?;";
            db.get(sqlGet, [ticket_id], (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    reject(new ItemNotFoundError());
                    return;
                }
                const ticket: Ticket = new Ticket(
                    row.ticket_id, 
                    row.service_type_id, 
                    row.queue_position, 
                    dayjs(row.issued_at).toDate(),
                    row.called_at ? dayjs(row.called_at).toDate() : null,
                    row.status
                );
                resolve(ticket);
            });
        });
    }


    public async createTicket(service_type_id: number, queue_position: number, issued_at: Date | null): Promise<Ticket> {
        if (service_type_id < 0 || queue_position < 0) {
            throw new InvalidInputError();
        }

        const sql = issued_at === null
            ? "INSERT INTO Tickets(service_type_id, queue_position) VALUES(?, ?)"
            : "INSERT INTO Tickets(service_type_id, queue_position, issued_at) VALUES(?, ?, ?)";
        const inputs = issued_at === null
            ? [service_type_id, queue_position]
            : [service_type_id, queue_position, dayjs(issued_at).toISOString()];
        let newTicketId: number;

        await new Promise<void>((resolve, reject) => {
            db.run(sql, inputs, function (err: Error | null) {
                if (err) {
                    if (err.message.includes("UNIQUE constraint failed: Tickets.ticket_id")) {
                        return reject(new ItemAlreadyExistsError());
                    }
                    return reject(err);
                }

                newTicketId = this.lastID;
                resolve();
            });
        });
        const fetchSql = "SELECT * FROM Tickets WHERE ticket_id = ?;";
        return new Promise<Ticket>((resolve, reject) => {
         db.get(fetchSql, [newTicketId], (err: Error | null, row: any) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return reject(new ItemNotFoundError());
                }
                const newTicket: Ticket = new Ticket(
                    row.ticket_id,
                    row.service_type_id,
                    row.queue_position,
                    dayjs(row.issued_at).toDate(),
                    row.called_at ? dayjs(row.called_at).toDate() : null,
                    row.status
                );

                resolve(newTicket);
            });

        });
    }
  
    public async getAllTickets(): Promise<Ticket[]> {
        const sql = "SELECT * FROM Tickets;";
        return new Promise<Ticket[]>((resolve, reject) => {
            db.all(sql, [], (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                const tickets: Ticket[] = rows.map(row => new Ticket(
                    row.ticket_id,
                    row.service_type_id,
                    row.queue_position,
                    dayjs(row.issued_at).toDate(),
                    row.called_at ? dayjs(row.called_at).toDate() : null,
                    row.status
                ));
                resolve(tickets);
            });
        });
    }

    public async getTicket(ticket_id: number): Promise<Ticket> {
        if (ticket_id < 0) {
            throw new InvalidInputError();
        }
        return this.fetchTicketById(ticket_id);
    }

    public async deleteTicket(ticket_id: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const sql = "DELETE FROM Tickets WHERE ticket_id=?";
            db.run(sql, [ticket_id], function (err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(new ItemNotFoundError());
                    return;
                }
                resolve(true);
            });
        });
    }

    public async updateTicket(ticket_id: number, queue_position?: number, called_at?: Date, status?: Status): Promise<Ticket> {
        let sqlUpdate = "UPDATE Tickets SET";
        const updates: string[] = [];
        const values: (Status | number | string | null)[] = [];

        if (called_at) {
            const formatted_called_at = dayjs(called_at).toISOString();
            updates.push(" called_at = ?");
            values.push(formatted_called_at);
        }

        if (status) {
            updates.push(" status = ?");
            values.push(status);
        }

        if (queue_position !== undefined && queue_position !== null) {
            updates.push(" queue_position = ?");
            values.push(queue_position);
        }

        if (updates.length === 0) {
            throw new InvalidInputError();
        }

        sqlUpdate += updates.join(", ") + " WHERE ticket_id = ?";
        values.push(ticket_id);

        return new Promise<Ticket>((resolve, reject) => {
            db.run(sqlUpdate, values, (err: Error | null) => {
                if (err) {
                    reject(err);
                    return;
                }
                // Reusing the fetchTicketById method after update
                this.fetchTicketById(ticket_id)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
}

export default TicketDAO;
