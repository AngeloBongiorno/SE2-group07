import db from "../db";
import { ServiceType } from "../models/ServiceType";
import { InvalidInputError, ItemNotFoundError, ItemAlreadyExistsError } from "./errors";


class ServiceTypeDAO {
  public createServiceType(name: string, avg_service_time: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                if (name.trim().length == 0 || avg_service_time < 0){
                    reject(new InvalidInputError());
                    return;
                }
                const sql = "INSERT INTO ServiceTypes(name, avg_service_time) VALUES(?, ?)"
                db.run(sql, [name, avg_service_time], (err: Error | null) => {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: ServiceTypes.service_type_id")) {
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

public getAllServiceTypes(): Promise<ServiceType[]> {
        return new Promise<ServiceType[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM ServiceType;"
                db.all(sql, [], (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const serviceTypes: ServiceType[] = rows.map(row => new ServiceType(row.service_type_id, row.name, row.avg_service_time));
                    resolve(serviceTypes);
                    return;
                })
            } catch (error) {
                reject(error);
            }

        })
    }

    public getServiceType(service_type_id: number): Promise<ServiceType> {
        return new Promise<ServiceType>((resolve, reject) => {
            try {
                if (service_type_id < 0) {
                    reject(new InvalidInputError());
                    return;
                }
                const sql = "SELECT * FROM ServiceTypes WHERE service_type_id = ?;"
                db.get(sql, [service_type_id], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!row) {
                      //TODO: add custom error for counter not found
                      reject(new ItemNotFoundError())
                    return;
                    }
                    const serviceType: ServiceType = new ServiceType(row.service_type_id, row.name, row.avg_service_time);
                    resolve(serviceType);
                })
            } catch (error) {
                reject(error);
            }

        })
    }


    deleteServiceType(service_type_id: number): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                const sql = "DELETE FROM ServiceTypes WHERE service_type_id=?"
                db.run(sql, [service_type_id], function(err: Error | null){
                    if(err){
                        reject(err)
                        return
                    }
                      if(this.changes === 0){
                          reject(new ItemNotFoundError())
                          return
                      }
                      resolve(true)
                  })
              })
    }

}

export default ServiceTypeDAO;
