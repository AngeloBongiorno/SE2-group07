"use strict"

import { Database } from "sqlite3";

export type DBCountType = {
    'COUNT(*)': number
}


// The database is created and the foreign keys are enabled.
const db: Database = new Database("./db.db", (err: Error | null) => {
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
})

export default db;
