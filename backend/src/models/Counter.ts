/**
 * Represents a Counter
 */
class Counter {
    counter_id: number
    name: string

    /**
     * Creates a new instance of the Counter class.
     * @param counter_id - The counter id. This is unique for each counter.
     * @param name - The name of the counter.
     */
    constructor(counter_id: number, name: string) {
        this.counter_id = counter_id
        this.name = name
    }
}

export { Counter }
