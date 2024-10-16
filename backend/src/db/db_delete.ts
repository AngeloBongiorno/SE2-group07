import db, { dbRun, dbAll } from './db';

async function dbDelete() {
    try {
        // Disable foreign key constraints
        await dbRun("PRAGMA foreign_keys = OFF");

        // Start a transaction
        await dbRun("BEGIN TRANSACTION");
        if (require.main === module) {
            console.log('> dbDelete transaction started.');
        }
        // console.log('dbDelete started.');


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
        if (require.main === module) {
            console.log('< dbDelete committed.');
        }
        // console.log('dbDelete completed.');

        // Re-enable foreign key constraints
        await dbRun("PRAGMA foreign_keys = ON");

        // Don't close the database connection here!!!
    } catch (error: any) {
        console.error('Error during database operation:', error.message);

        // Rollback the transaction in case of error
        try {
            await dbRun("ROLLBACK");
            console.log('< dbDelete rolled back.');
        } catch (rollbackError: any) {
            console.error('Error during rollback:', rollbackError.message);
        }
    }
}


// Conditionally call dbDelete() if the module is run directly
if (require.main === module) {
    dbDelete();
}

export {dbDelete};