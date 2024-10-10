import db from "../db"
import { DailyQueueStat } from "../models/dailyQueueStat";
import { ItemAlreadyExistsError } from "./errors";


function formatDateForSQL(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function fromSqlDate(sqlDate: string): Date {
    const [year, month, day] = sqlDate.split('-').map(Number);
    return new Date(year, month - 1, day);
}

class DailyQueueStatDAO {
  public createDailyQueueStat(counter_id: number, service_type_id: number, date: Date, served_count?: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                // if arrivalDate is not null and is after the current date, throw a DateError
                if (counter_id < 0 || service_type_id < 0){
                    // TODO: reject with custom error
                    //reject(new DateError());
                    return;
                }
                const sql = "INSERT INTO DailyQueueStats (counter_id, service_type_id, date, served_count) VALUES (?, ?, ?, ?)"
                db.run(sql, [counter_id, service_type_id, formatDateForSQL(date), served_count], (err: Error | null) => {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: DailyQueueStats.stat_id")) {
                          reject(new ItemAlreadyExistsError());
                        } else {
                          reject(err);
                        }
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


    public getDailyQueueStat(stat_id: number): Promise<DailyQueueStat> {
        return new Promise<DailyQueueStat>((resolve, reject) => {
            try {
                if (stat_id < 0) {
                    // TODO: reject with custom error
                    //reject(new DateError());
                    return;
                }
                const sql = "SELECT * FROM DailyQueueStat WHERE stat_id = ?;"
                db.get(sql, [stat_id], (err: Error | null, row: any) => {
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
                    const dailyQueueStat: DailyQueueStat = new DailyQueueStat(row.stat_id, row.counter_id, row.service_type_id, fromSqlDate(row.date), row.served_count);
                    resolve(dailyQueueStat);
                })
            } catch (error) {
                reject(error);
            }

        })
    }


    deleteDailyQueueStat(stat_id: number): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                const sql = "DELETE FROM DailyQueueStats WHERE stat_id = ?"
                db.run(sql, [stat_id], function(err: Error | null){
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


    updateDailyQueueStat(stat_id: number, counter_id?: number, service_type_id?: number, date?: Date, served_count?: number): Promise<DailyQueueStat>{
      return new Promise<DailyQueueStat>((resolve, reject) =>{
        let sqlUpdate = "UPDATE DailyQueueStat SET";
        const updates: string[] = [];
        const values: (number | string)[] = [];

        if (date) {
                const formatted_date = formatDateForSQL(date);
                updates.push(" formatted_date = ?");
                values.push(formatted_date);
        }
        if (counter_id) {
                 updates.push(" counter_id = ?");
                 values.push(counter_id);
        }
        if (service_type_id) {
          updates.push(" service_type_id = ?");
          values.push(service_type_id);
        }
        if (served_count) {
          updates.push(" served_count = ?");
          values.push(served_count);
        }
        if (updates.length === 0) {
                 return reject(new Error("At least one field must be updated."));
        }

             sqlUpdate += updates.join(", ") + " WHERE ticket_id = ?";
             values.push(stat_id);

        db.run(sqlUpdate, values, (err: Error | null) => {
            if (err) {
                reject(err)
                return;
            }
            const sqlGet = "SELECT * FROM DailyQueueStats WHERE stat_id = ?"
            db.get(sqlGet, [stat_id], (err: Error | null, row: any) => {
                if (err) {
                    reject(err)
                    return;
                }   
                if(!row){
                    //TODO: add custom error
                    //reject(new UserNotFoundError())
                    return;
                }
                const dailyQueueStat: DailyQueueStat = new DailyQueueStat(row.stat_id, row.counter_id, row.service_type_id, fromSqlDate(row.date), row.served_count);
                resolve(dailyQueueStat);
            })
        })
     })
    }

}


export { DailyQueueStat }
