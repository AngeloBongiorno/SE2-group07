import * as fs from 'fs';
import * as path from 'path';
import db, { dbRun, dbAll } from './db';

async function dbPopulate() {
    const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'sample_data.sql');
    // const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'more_sample_data.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    try {
        // Start a transaction
        await dbRun("BEGIN TRANSACTION");
        if (require.main === module) {
            console.log('> dbPopulate transaction started.');
        }

        // Execute SQL script
        const queries = sqlScript.split(';').filter(query => query.trim());
        for (const query of queries) {
            try {
                await dbRun(query);
            } catch (err: any) {
                console.error('Error executing query:', query);
                console.error('Error is:', err.message, '\n');
                throw err; // Throw error to trigger rollback
            }
        }

        // Commit the transaction
        await dbRun("COMMIT");
        if (require.main === module) {
            console.log('< dbPopulate committed.');
        }
    } catch (error: any) {
        if (require.main === module) {
            console.error('Error during database operation:', error.message);
        }

        // Rollback the transaction in case of error
        try {
            await dbRun("ROLLBACK");
            if (require.main === module) {
                console.log('Transaction rolled back.');
            }
        } catch (rollbackError: any) {
            console.error('Error during rollback:', rollbackError.message);
        }
    }
}

if (require.main === module) {
    dbPopulate();
}


export { dbPopulate };