import db from "./db";

export async function cleanup() {
    await db.run("DELETE FROM CounterServices");
    await db.run("DELETE FROM Counters");
    await db.run("DELETE FROM DailyQueueStats");
    await db.run("DELETE FROM ServiceTypes");
    await db.run("DELETE FROM Tickets");
}