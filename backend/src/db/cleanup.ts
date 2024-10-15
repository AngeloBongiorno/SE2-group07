import { asyncdb } from "./db";

export async function cleanup() {
    console.log("clean up");
    await asyncdb.asyncRun("DELETE FROM CounterServices");
    await asyncdb.asyncRun("DELETE FROM Counters");
    await asyncdb.asyncRun("DELETE FROM DailyQueueStats");
    await asyncdb.asyncRun("DELETE FROM ServiceTypes");
    await asyncdb.asyncRun("DELETE FROM Tickets");
}