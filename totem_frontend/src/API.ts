const postTicket = async (service_type_id: number): Promise<TicketResponse | null> => {
    const requestUrl = `http://localhost:3001/officequeue/ticket`;
    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({service_id: service_type_id}),
      });

      const json = await response.json();
      if (json && typeof json.message === 'string' &&
          typeof json.ticket_code === 'number' &&
          typeof json.service_id === 'number' &&
          typeof json.queue_position === 'number' &&
          typeof json.qr === 'string') {
        return json as TicketResponse;
      } else {
        console.error("Invalid response format");
        return null;
      }
    } catch (error) {
      console.error("Error in postTicket:", error);
      return null; // Handle errors
    }
}


const getServices = async (): Promise<Service[] | null> => {
    const requestUrl = `http://localhost:3001/officequeue/services`;

    try {
      const response = await fetch(requestUrl);
      const json = await response.json();
      if (json && typeof json.service_id === "number" &&
         typeof json.service_name === "string" &&
         typeof json.avg_service_time === "number") {
        return json as Service[];
      } else {
        console.error("Invalid response format");
        return null;
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      return null;
    }
}


export interface TicketResponse {
  message: string;
  ticket_code: number;
  service_id: number;
  queue_position: number;
  qr: string;
}

export interface Service {
  service_id: number;
  service_name: string,
  avg_service_time: number,
}


const API = { postTicket, getServices };
export default API;
