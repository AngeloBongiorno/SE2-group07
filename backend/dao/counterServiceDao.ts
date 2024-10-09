import db from "../db"
import { CounterService } from "../models/CounterService";
import { InvalidInputError, ItemAlreadyExistsError, ItemNotFoundError } from "./errors";


class CounterServiceDAO {
  public createCounterService(counter_id: number, service_type_id: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                if (counter_id < 0 || service_type_id < 0){
                    reject(new InvalidInputError());
                    return;
                }
                const sql = "INSERT INTO CounterServices (counter_id, service_type_id) VALUES(?, ?)"
                db.run(sql, [counter_id, service_type_id], (err: Error | null) => {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: CounterService.counter_service_id")) reject(new ItemAlreadyExistsError());
                        reject(err);
                    }
                    resolve(true);
                })
            } catch (error) {
                reject(error);
            }

        })
    }

public getAllCounterServices(): Promise<CounterService[]> {
        return new Promise<CounterService[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM CounterService;"
                db.all(sql, [], (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject(err);
                    }
                    const counters: CounterService[] = rows.map(row => new CounterService(row.counter_service_id, row.counter_id, row.service_type_id));
                    resolve(counters);
                })
            } catch (error) {
                reject(error);
            }

        })
    }

    public getAllCounterService(counter_service_id: number): Promise<CounterService> {
        return new Promise<CounterService>((resolve, reject) => {
            try {
                if (counter_service_id < 0) {
                    reject(new InvalidInputError());
                    return;
                }
                const sql = "SELECT * FROM Counters WHERE counter_id = ?;"
                db.get(sql, [counter_service_id], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!row) {
                      reject(new ItemNotFoundError())
                    return;
                    }
                    const counter: CounterService = new CounterService(row.counter_service_id, row.counter_id, row.service_type_id);
                    resolve(counter);
                })
            } catch (error) {
                reject(error);
            }

        })
    }


    public deleteCounterService(counter_service_id: number): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                const sql = "DELETE FROM CounterService WHERE counter_service_id=?"
                db.run(sql, [counter_service_id], function(err: Error | null){
                    if(err){
                        reject(err);
                        return;
                    }
                      if(this.changes === 0){
                          reject(new ItemNotFoundError())
                          return
                      }
                      resolve(true);
                      return;
                  })
              })
    }


    public updateCounterService(counter_service_id: number, counter_id?: number, service_type_id?: number): Promise<CounterService>{
      return new Promise<CounterService>((resolve, reject) =>{
        let sqlUpdate = "UPDATE CounterServices SET";
        const updates: string[] = [];
        const values: number[] = [];

        if (counter_id) {
                updates.push(" counter_id = ?");
                values.push(counter_id);
        } 
        if (service_type_id) {
               updates.push(" service_type_id = ?");
                values.push(service_type_id);
        }
        if (updates.length === 0) {
              reject(new InvalidInputError());
              return;
        }

        sqlUpdate += updates.join(", ") + " WHERE ticket_id = ?";
        values.push(counter_service_id);

        db.run(sqlUpdate, values, (err: Error | null) => {
            if (err) {
                reject(err)
                return;
            }
            const sqlGet = "SELECT * FROM CounterServices WHERE counter_service_id = ?"
            db.get(sqlGet, [counter_service_id], (err: Error | null, row: any) => {
                if (err) {
                    reject(err)
                    return;
                }   
                if(!row){
                    reject(new ItemNotFoundError())
                    return;
                }
                const counterService: CounterService = new CounterService(row.counter_service_id, row.counter_id, row.service_type_id);
                resolve(counterService);
                return;
            })
        })
     })
    }
}

export default CounterServiceDAO;
