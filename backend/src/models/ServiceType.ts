/**
 * Represents a Service type 
 */
class ServiceType {
    service_type_id: number
    name: string
    avg_service_time: number

    /**
     * Creates a new instance of the ServiceType class.
     * @param counter_id - The service type id. This is unique for each service type.
     * @param name - The name of the service.
     * @param avg_service_time - Average time needed to serve this service
     */
    constructor(service_type_id: number, name: string, avg_service_time: number) {
        this.service_type_id = service_type_id 
        this.name = name
        this.avg_service_time = avg_service_time
    }
}

export { ServiceType }
