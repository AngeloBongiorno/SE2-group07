const requestUrl = `http://localhost:3001/officequeue/nextCustomer`;
/*
 * Complies to the POST nextCustomer API in API.md
 * returns null and prints an error if something went wrong with request.
 */
const nextCustomer = async (counter_id: number): Promise<TicketToShow | null> => {
    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counter_id }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      let calledTicket: TicketToShow = await response.json();
      console.log('fetched this ticket: ', calledTicket);
      return calledTicket;
    } catch (error) {
      console.error('Error fetching the next Customer ticket', error);
      return null;
    }
}

interface TicketToShow {
    ticket_id: number,
    service_type_id: number,
    queue_position: number,
    issued_at: string,
    called_at: string,
    status: string
}



const API = { nextCustomer };
export default API;