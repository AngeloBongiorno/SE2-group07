import * as sqlite from 'sqlite3';
import { Database } from 'sqlite3';
import * as path from 'path';

const dbPath = path.join(__dirname, 'db.db');

const db: Database = new sqlite.Database(dbPath, (err: Error | null) => {
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
})

export default db;