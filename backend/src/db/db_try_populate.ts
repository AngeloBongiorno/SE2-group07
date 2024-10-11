import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import db from './db';

function dbCreate() {
    // const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'sample_data.sql');
    const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'more_sample_data.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    db.serialize(() => {
        const queries = sqlScript.split(';').filter(query => query.trim());
        for (const query of queries) {
            console.log(query);
            db.run(query, (err) => {
                if (err) {
                    console.error('Error executing query:', err.message);
                }
            });
        }
        console.log('SQL script executed successfully.');
    });

    db.close((err) => {
        if (err) {
            console.error('Error while closing the database:', err.message);
        }
    });
}

dbCreate();