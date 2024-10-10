<<<<<<< HEAD
"use strict"

import { Database } from "sqlite3";

export type DBCountType = {
    'COUNT(*)': number
}


// The database is created and the foreign keys are enabled.
const db: Database = new Database("./db.db", (err: Error | null) => {
=======
import * as sqlite from 'sqlite3';
import { Database } from 'sqlite3';
import * as path from 'path';

const dbPath = path.join(__dirname, 'db.db');

const db: Database = new sqlite.Database(dbPath, (err: Error | null) => {
>>>>>>> Sprint-1
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
})

<<<<<<< HEAD
export default db;
=======
export default db;
>>>>>>> Sprint-1
