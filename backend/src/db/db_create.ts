import * as fs from 'fs';
import * as path from 'path';
import db, { dbRun, dbAll } from './db';
import { promisify } from 'util';

async function dbCreate() {
    const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'query.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    try {
        // Start transaction
        await dbRun("BEGIN TRANSACTION");
        if (require.main === module) {
            console.log('> dbCreate transaction started.');
        }
        // console.log('dbCreate started.');

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

            // console.log(`Query #${queries.indexOf(query) + 1} executed successfully.`);
        }

        // Commit or rollback transaction
        if (errorOccurred) {
            await dbRun("ROLLBACK");
            if (require.main === module) {
                console.error('< dbCreate rolled back.');
            }
            return;
        }

        await dbRun("COMMIT");
        if (require.main === module) {
            console.log('< dbCreate committed.');
        }
        // console.log('dbCreate completed.');

        // Don't close the database connection here!!!
    } catch (error: any) {
        console.error('Error during database operation:', error.message);
    }
}

// Conditionally call dbCreate() if the module is run directly
if (require.main === module) {
    dbCreate();
}

export { dbCreate };