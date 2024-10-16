import * as fs from 'fs';
import * as path from 'path';
import db from './db';
import { promisify } from 'util';

const dbRun = promisify(db.run.bind(db));

async function dbCreate() {
    const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'query.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    try {
        // Start transaction
        await dbRun("BEGIN TRANSACTION");
        console.log('dbCreate transaction started.');

        // Execute SQL script
        const queries = sqlScript.split(';').filter(query => query.trim());
        let errorOccurred = false;
        for (const query of queries) {
            try {
                await dbRun(query);
            } catch (err: any) {
                const firstLineOfQuery = query.trim().split('\n')[0];
                const secondLineOfQuery = query.trim().split('\n')[1];
                console.error(`Error executing query: ${firstLineOfQuery}`);
                console.error('Error is:', err.message, '\n');

                // Set flag for rolling back transaction
                errorOccurred = true;
            }

            console.log(`Query #${queries.indexOf(query) + 1} executed successfully.`);
        }

        // Commit or rollback transaction
        if (errorOccurred) {
            await dbRun("ROLLBACK");
            console.error('Database creation rolled back.');
            return;
        }

        await dbRun("COMMIT");
        console.log('Database creation committed.');

        db.close((err: any) => {
            if (err) {
                console.error('Error while closing the database:', err.message);
            }
        });
    } catch (error: any) {
        console.error('Error during database operation:', error.message);
    }
}

dbCreate();