import * as fs from 'fs';
import * as path from 'path';
import db from './db';
import { promisify } from 'util';

const dbRun = promisify(db.run.bind(db));

async function dbCreate() {
    const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'sample_data.sql');
    // const sqlFilePath = path.join(__dirname, '..', '..', 'db_design', 'more_sample_data.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    try {
        // Start a transaction
        await dbRun("BEGIN TRANSACTION");

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
        console.log('SQL script executed successfully.');

        // Close the database connection
        db.close((err: any) => {
            if (err) {
                console.error('Error while closing the database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    } catch (error: any) {
        console.error('Error during database operation:', error.message);

        // Rollback the transaction in case of error
        try {
            await dbRun("ROLLBACK");
            console.log('Transaction rolled back.');
        } catch (rollbackError: any) {
            console.error('Error during rollback:', rollbackError.message);
        }
    }
}

dbCreate();