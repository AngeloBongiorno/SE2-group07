"use strict"

import * as sqlite from 'sqlite3';
import { Database, RunResult } from 'sqlite3';
import * as path from 'path';

export type DBCountType = {
    'COUNT(*)': number
}

const dbPath = path.join(__dirname, 'db.db');

const db: Database = new sqlite.Database(dbPath, (err: Error | null) => {
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
})

class AsyncDb {
    private db: Database

    constructor(db: Database) {
        this.db = db
    }

    asyncRun(query: string, params?: any[]): Promise<RunResult> {
        return new Promise<RunResult>((resolve, reject) => {
            this.db.run(query, params, function(err: Error | null) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            })
        })
    }

    asyncGet(query: string, params: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            })
        })
    };
    
    asyncAll(query: string, params: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    };

    close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

const asyncdb = new AsyncDb(db)

export default db;

export {asyncdb};
