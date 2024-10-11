import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import db from './db';

function dbCreate() {
    const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'query.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    db.serialize(() => {
        db.run("BEGIN TRANSACTION", (err) => {
            if (err) {
                console.error('Error starting transaction:', err.message);
                return;
            }

            const queries = sqlScript.split(';').filter(query => query.trim());
            for (const query of queries) {
                db.run(query, (err) => {
                    if (err) {
                        console.error('Error executing query:', err.message);
                        db.run("ROLLBACK", (rollbackErr) => {
                            if (rollbackErr) {
                                console.error('Error rolling back transaction:', rollbackErr.message);
                            }
                        });
                        return;
                    }
                });
            }

            db.run("COMMIT", (err) => {
                if (err) {
                    console.error('Error committing transaction:', err.message);
                    db.run("ROLLBACK", (rollbackErr) => {
                        if (rollbackErr) {
                            console.error('Error rolling back transaction:', rollbackErr.message);
                        }
                    });
                } else {
                    console.log('SQL script executed successfully.');
                }
            });

            db.close((err) => {
                if (err) {
                    console.error('Error while closing the database:', err.message);
                }
            });
        });
    });


}

dbCreate();