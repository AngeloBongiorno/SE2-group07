import CounterServiceDAO from "../dao/counterServiceDao";
import TicketDAO from "../dao/TicketDao";
import { ServiceType } from "../models/ServiceType";
import { Ticket } from "../models/Ticket";

/*
creae the queues for each service that the officer offers
select the shortest one
in case of equal length, find the shortest service time
once i know which service i want to serve the system selects the first ticket that has not been served
set the ticket of the client as called
*/
class NextCustomerController {
    private counterServiceDAO: CounterServiceDAO;
    private ticketDAO: TicketDAO;

    constructor() {
        this.counterServiceDAO = new CounterServiceDAO;
        this.ticketDAO = new TicketDAO;
    }

    public async NextCustomer(counter_id: string): Promise<Ticket>{
        console.log(counter_id);
        const services:ServiceType[] = await this.counterServiceDAO.getServices(counter_id);
        console.log(services);
        let lengths = [];
        let queues = [];
        for(const service of services){
            let l = await this.ticketDAO.getQueuesLength(service.service_type_id);
            const t = {length:l,
                     service: service};
            lengths.push(l);
            queues.push(t);
        }
        //console.log(queues);
        //console.log(lengths);
        const min = Math.min(...lengths);
        let next_service: ServiceType;
        let queues2:any[] = [];
        for(const i of queues) {
            if(i.length == min) {
                queues2.push(i);
            }
        }
        queues2.sort((a:any,b:any)=>a.service.avg_service_time - b.service.avg_service_time);
        //console.log(queues2);
        next_service = queues2[0].service;
        const ticket_id = await this.ticketDAO.getFirstTicket(next_service.service_type_id);
        console.log(ticket_id);
        const ticket:Ticket = await this.ticketDAO.setTicketAsCalled(ticket_id);
        return ticket;

    }
}

export default NextCustomerController;