import db from './db';
import { promisify } from 'util';

const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

async function dbEmpty() {
    try {
        // Disable foreign key constraints
        await dbRun("PRAGMA foreign_keys = OFF");

        // Start a transaction
        await dbRun("BEGIN TRANSACTION");

        // Get the list of all tables
        const tables: any = await dbAll("SELECT name FROM sqlite_master WHERE type='table'");

        // Generate and execute DROP TABLE statements for each table
        for (const table of tables) {
            // Skip sqlite_sequence table as it cannot be dropped
            if (table.name === 'sqlite_sequence') {
                continue;
            }

            const dropQuery = `DROP TABLE IF EXISTS "${table.name}";`;
            await dbRun(dropQuery);
        }

        // Commit the transaction
        await dbRun("COMMIT");
        console.log('Database emptying committed.');

        // Re-enable foreign key constraints
        await dbRun("PRAGMA foreign_keys = ON");

        // Close the database connection
        db.close((err: any) => {
            if (err) {
                console.error('Error closing database:', err.message);
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

dbEmpty();