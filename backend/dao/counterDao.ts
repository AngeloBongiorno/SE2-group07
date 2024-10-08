import db from "../db"
import { Counter } from "../models/Counter"


class CounterDAO {
  public createCounter(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                // if arrivalDate is not null and is after the current date, throw a DateError
                if (name.trim().length == 0){
                    // TODO: reject with custom error
                    //reject(new DateError());
                    return;
                }
                const sql = "INSERT INTO Counters(name) VALUES(?)"
                db.run(sql, [name], (err: Error | null) => {
                    if (err) {
                        // TODO: add custom error for non unique counter
                        //if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError);
                        reject(err);
                    }
                    resolve(true);
                })
            } catch (error) {
                reject(error);
            }

        })
    }

public getAllCounters(): Promise<Counter[]> {
        return new Promise<Counter[]>((resolve, reject) => {
            try {
                // if arrivalDate is not null and is after the current date, throw a DateError
                const sql = "SELECT * FROM Counters;"
                db.all(sql, [], (err: Error | null, rows: any[]) => {
                    if (err) {
                        // TODO: add custom error for non unique counter
                        //if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError);
                        reject(err);
                    }
                    const counters: Counter[] = rows.map(row => new Counter(row.counter_id, row.name));
                    resolve(counters);
                })
            } catch (error) {
                reject(error);
            }

        })
    }

    public getCounter(id: number): Promise<Counter> {
        return new Promise<Counter>((resolve, reject) => {
            try {
                if (id < 0) {
                    // TODO: reject with custom error
                    //reject(new DateError());
                    return;
                }
                const sql = "SELECT * FROM Counters WHERE counter_id = ?;"
                db.get(sql, [id], (err: Error | null, row: any) => {
                    if (err) {
                        // TODO: add custom error for non unique counter
                        //if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError);
                        reject(err);
                    }
                    if (!row) {
                      //TODO: add custom error for counter not found
                      //reject(new UserNotFoundError())
                    return
                    }
                    const counter: Counter = new Counter(row.counter_id, row.name);
                    resolve(counter);
                })
            } catch (error) {
                reject(error);
            }

        })
    }


    deleteCounter(counter_id: number): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                const sql = "DELETE FROM Counters WHERE counter_id=?"
                db.run(sql, [counter_id], function(err: Error | null){
                    if(err){
                        reject(err)
                        return
                    }
                      if(this.changes === 0){
                          // TODO: reject with custom error
                          //reject(new UserNotFoundError())
                          return
                      }
                      resolve(true)
                  })
              })
    }


    updateCounter(counter_id: number, name: string): Promise<Counter>{
      return new Promise<Counter>((resolve, reject) =>{
        const sqlUpdate = "UPDATE Counters SET name=? WHERE counter_id=?"
        db.run(sqlUpdate, [name, counter_id], (err: Error | null) => {
            if (err) {
                reject(err)
                return;
            }
            const sqlGet = "SELECT * FROM Counters WHERE counter_id = ?"
            db.get(sqlGet, [counter_id], (err: Error | null, row: any) => {
                if (err) {
                    reject(err)
                    return;
                }   
                if(!row){
                    //TODO: add custom error
                    //reject(new UserNotFoundError())
                    return;
                }
                const counter: Counter = new Counter(row.counter_id, row.name);
                resolve(counter);
            })
        })
     })
    }
}

export default CounterDAO;
