/**
 * Represents a Daily queue stat type 
 */
class DailyQueueStat {
    stat_id: number;
    counter_id: number;
    service_type_id: number;
    date: Date;
    served_count: number;

    /**
     * Creates a new instance of the DailyQueueStat class.
     * @param stat_id - the stat id. This is unique for each daily queue stat.
     * @param counter_id - The counter related to the stat.
     * @param service_type_id - The service_type_id related to the stat
     * @param date - The date related to the stat
     * @param served_count - number of served tickets for this stat
     */
    constructor(stat_id: number, counter_id: number, service_type_id: number, date: Date, served_count: number) {
        this.stat_id = stat_id
        this.counter_id = counter_id
        this.service_type_id = service_type_id
        this.date = date
        this.served_count = served_count
    }
}

export { DailyQueueStat }
