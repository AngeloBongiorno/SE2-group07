/**
 * Represents the link between a counter and a servce that it offers;
 */
class CounterService {
    counter_service_id: number;
    counter_id: number;
    service_type_id: number;


    /**
     * Creates a new instance of the CounterService class.
     * @param counter_service_id - This is unique for each counter and service pair.
     * @param counter_id - The id of the counter.
     * @param service_type_id - The id of the service type.
     */
    constructor(counter_service_id: number, counter_id: number, service_type_id: number) {
      this.counter_service_id = counter_service_id;
      this.counter_id = counter_id;
      this.service_type_id = service_type_id;
    }
}

export { CounterService }
