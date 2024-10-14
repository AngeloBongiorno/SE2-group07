import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import db from './db';

function dbCreate() {
    const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'query.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    db.serialize(() => {
        const queries = sqlScript.split(';').filter(query => query.trim());
        for (const query of queries) {
            db.run(query, (err) => {
                if (err) {
                    const firstLineOfQuery = query.trim().split('\n')[0];
                    console.error('Error executing query:', firstLineOfQuery);
                    console.error('Error is:', err.message, '\n');
                }
            });
        }
        console.log('SQL script executed successfully.');

        db.close((err) => {
            if (err) {
                console.error('Error while closing the database:', err.message);
            }
        });
    });
}

dbCreate();