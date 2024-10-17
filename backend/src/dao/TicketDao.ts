import db, { asyncdb } from "../db/db"
import { Ticket, Status } from "../models/Ticket"
import { InvalidInputError, ItemAlreadyExistsError, ItemNotFoundError } from "./errors";
import dayjs from "dayjs";



class TicketDAO {
  public createTicket(service_type_id: number, queue_position: number, issued_at: Date | null ): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                if (service_type_id < 0 || queue_position < 0){
                    reject(new InvalidInputError());
                    return;
                }
                let sql: string;
                let inputs: any[];
                if (issued_at === null) {
                  sql = "INSERT INTO Tickets(service_type_id, queue_position) VALUES(?, ?)";
                  inputs = [service_type_id, queue_position];
                } else {
                  const formatted_issued_at = dayjs(issued_at).toISOString();
                  sql = "INSERT INTO Tickets(service_type_id, queue_position, issued_at) VALUES(?, ?, ?)";
                  inputs = [service_type_id, queue_position, formatted_issued_at];
                }
                db.run(sql, inputs, (err: Error | null) => {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: Tickets.ticket_id")) reject(new ItemAlreadyExistsError());
                        reject(err);
                        return;
                    }
                    resolve(true);
                    return;
                })
            } catch (error) {
                reject(error);
            }

        })
    }

    public getAllTickets(): Promise<Ticket[]> {
        return new Promise<Ticket[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM Tickets;"
                db.all(sql, [], (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const tickets: Ticket[] = rows.map(row => new Ticket(row.ticket_id,
                                                                        row.service_type_id,row.queue_position,
                                                                        dayjs(row.issued_at).toDate(),
                                                                        row.called_at ? dayjs(row.called_at).toDate() : null,
                                                                        row.status));
                    resolve(tickets);
                    return;
                })
            } catch (error) {
                reject(error);
            }

        })
    }

    /*public getQueuesLength(service_type_id: number) :Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try{
                const sql = "SELECT COUNT(*) as count FROM Tickets WHERE service_type_id=?";
                db.get(sql, [service_type_id], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(row.count);
                })
            }
            catch(error){
                reject(error);
            }
        })
    }*/

    async getQueuesLength(service_type_id: number) :Promise<number> {
        const sql = "SELECT COUNT(*) as count FROM Tickets WHERE service_type_id=? AND status='waiting'";
        const row = await asyncdb.asyncGet(sql,[service_type_id]);
        return row.count;
    }


    /*public getFirstTicket(service_type_id: number): Promise<number> {
        return new Promise<number>((resolve,reject) => {
            try{
                const sql = "SELECT ticket_id FROM Tickets WHERE status='waiting' AND service_type_id=? ORDER BY issued_at ASC LIMIT 1";
                db.get(sql,[service_type_id],(err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!row) {
                        reject(new ItemNotFoundError());
                        return;
                      }
                    resolve(row.ticket_id);
                    return;
                })
            }
            catch(error){
                reject(error);
            }
        })
    }*/

    async getFirstTicket(service_type_id: number): Promise<number> {
        const sql = "SELECT ticket_id FROM Tickets WHERE status='waiting' AND service_type_id=? ORDER BY issued_at ASC LIMIT 1";
        const row = await asyncdb.asyncGet(sql,[service_type_id]);
        if (!row) {
            throw new Error("No tickets found for the specified service_type_id");
        }        
        return row.ticket_id;
    }

    /*public setTicketAsCalled(ticket_id: number): Promise<Ticket> {
        return new Promise<Ticket>((resolve,reject) => {
            try{
                const sql = "UPDATE Tickets SET called_at=datetime('now'),status='called' WHERE ticket_id=?";
                db.run(sql, [ticket_id], function (err: Error | null) {
                    if (err) {
                        reject(err); 
                        return;
                    }
                })
                this.getTicket(ticket_id).then(ticket => {
                    resolve(ticket); 
                }).catch(error => {
                    reject(error); 
                });
            }
            catch(error){
                reject(error);
            }
        })
    }*/

    async setTicketAsCalled(ticket_id: number): Promise<Ticket> {
        const sql = "UPDATE Tickets SET called_at=datetime('now'),status='called' WHERE ticket_id=?";
        const result = await asyncdb.asyncRun(sql,[ticket_id]);
        const ticket = await this.getTicket2(ticket_id);
        return ticket;
    }

    async getTicket2(ticket_id: number): Promise<Ticket> {
        const sql = "SELECT * FROM Tickets WHERE ticket_id = ?;"
        const ticket = await asyncdb.asyncGet(sql,[ticket_id]);
        if (!ticket){
            throw new Error("ticket not found");
        }
        return ticket
    }

    public getTicket(ticket_id: number): Promise<Ticket> {
        return new Promise<Ticket>((resolve, reject) => {
            try {
                if (ticket_id < 0) {
                    reject(new InvalidInputError());
                    return;
                }
                const sql = "SELECT * FROM Tickets WHERE ticket_id = ?;"
                db.get(sql, [ticket_id], (err: Error | null, row: any) => {
                    if (err) {
                        // TODO: add custom error for non unique counter
                        if (err.message.includes("UNIQUE constraint failed: Tickets.ticket_id")) {
                          reject(new ItemAlreadyExistsError());
                        } else {
                          reject(err);
                        }
                        return;
                    }
                    if (!row) {
                      reject(new ItemNotFoundError());
                      return;
                    }
                    const ticket: Ticket = new Ticket (row.ticket_id,
                                                      row.service_type_id,
                                                      row.queue_position,
                                                      row.issued_at,
                                                      row.called_at,
                                                      row.status);
                    resolve(ticket);
                    return;
                })
            } catch (error) {
                reject(error);
            }

        })
    }


    deleteTicket(ticket_id: number): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                const sql = "DELETE FROM Tickets WHERE ticket_id=?"
                db.run(sql, [ticket_id], function(err: Error | null){
                    if(err){
                        reject(err)
                        return
                    }
                      if(this.changes === 0){
                          reject(new ItemNotFoundError());
                          return;
                      }
                      resolve(true);
                      return;
                  })
              })
    }


    updateTicket(ticket_id: number, queue_position?: number, called_at?: Date, status?: Status): Promise<Ticket>{
      return new Promise<Ticket>((resolve, reject) =>{
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
        if (queue_position !== undefined) {
                updates.push(" queue_position = ?");
                values.push(queue_position);
        }

        if (updates.length === 0) {
              reject(new InvalidInputError());
              return;
        }

        sqlUpdate += updates.join(", ") + " WHERE ticket_id = ?";
        values.push(ticket_id); // Add ticket_id to the parameters

        db.run(sqlUpdate, values, (err: Error | null) => {
            if (err) {
                reject(err)
                return;
            }
            const sqlGet = "SELECT * FROM Tickets WHERE ticket_id = ?"
            db.get(sqlGet, [ticket_id], (err: Error | null, row: any) => {
                if (err) {
                    reject(err)
                    return;
                }   
                if(!row){
                    reject(new ItemNotFoundError())
                    return;
                }
                const ticket: Ticket = new Ticket(row.ticket_id, row.service_type_id, row.queue_position, dayjs(row.issued_at).toDate(),
                                                  row.called_at ? dayjs(row.called_at).toDate() : null,
                                                  row.status);
                resolve(ticket);
            });
        });
     })
    }
}

export default TicketDAO;
