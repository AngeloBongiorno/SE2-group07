import db, { asyncdb } from "../db/db"
import { CounterService } from "../models/CounterService";
import { ServiceType } from "../models/ServiceType";
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

public getAllCounterServices(): Promise<CounterService[]> {
        return new Promise<CounterService[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM CounterService;"
                db.all(sql, [], (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const counters: CounterService[] = rows.map(row => new CounterService(row.counter_service_id, row.counter_id, row.service_type_id));
                    resolve(counters);
                    return;
                })
            } catch (error) {
                reject(error);
            }

        })
    }

    /*public getServices(counter_id: string) :Promise<ServiceType[]> {
        return new Promise<ServiceType[]>((resolve, reject) => {
            try{
                const sql = "SELECT * FROM ServiceTypes s JOIN CounterServices cs ON s.service_type_id = cs.service_type_id WHERE counter_id=?";
                db.all(sql, [counter_id], (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!rows) {
                      reject(new ItemNotFoundError())
                    return;
                    }
                    const services: ServiceType[] = rows.map(row => new ServiceType(row.service_type_id,row.name,row.avg_service_time));
                    resolve(services);
                    return;
                })
            }
            catch(error){
                reject(error);
            }
        })
    }*/

    async getServices(counter_id: string) :Promise<ServiceType[]> {
        try{
            const sql = "SELECT * FROM ServiceTypes s JOIN CounterServices cs ON s.service_type_id = cs.service_type_id WHERE counter_id=?";
            const rows = await asyncdb.asyncAll(sql,[counter_id]);
            const services: ServiceType[] = rows.map(row => new ServiceType(row.service_type_id,row.name,row.avg_service_time));
            if (services.length == 0){
                throw new Error("the counter does not offer any service");
            }
            return services;
        }
        catch(error){
            throw error;
        }

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
                    return;
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
