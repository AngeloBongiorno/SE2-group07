import { promisify } from 'util';
import db, { dbRun, dbAll } from './db';

async function dbEmpty() {
    try {
        // Disable foreign key constraints
        await dbRun("PRAGMA foreign_keys = OFF");

        // Start a transaction
        await dbRun("BEGIN TRANSACTION");
        if (require.main === module) {
            console.log('< dbEmpty transaction started.');
        }

        // Get the list of all tables
        const tables: any = await dbAll("SELECT name FROM sqlite_master WHERE type='table'");

        // Generate and execute DELETE statements for each table
        for (const table of tables) {
            const deleteQuery = `DELETE FROM "${table.name}";`;
            await dbRun(deleteQuery);
        }

        // Commit the transaction
        await dbRun("COMMIT");
        if (require.main === module) {
            console.log('> dbEmpty committed.');
        }

        // Re-enable foreign key constraints
        await dbRun("PRAGMA foreign_keys = ON");
    } catch (error: any) {
        console.error('Error during database operation:', error.message);

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
    dbEmpty();
}

export { dbEmpty };