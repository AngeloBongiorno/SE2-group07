import { useState } from 'react';
import API from './API'

function TicketComponent(props: any) {

  const [qrCode, setQrCode] = useState();
  const [ticketNumber, setTicketNumber] = useState();
  const [serviceId, setServiceId] = useState();
  const [queuePosition, setQueuePosition] = useState();

  const newTicket = async (service_type_id: number) => {
    try {
      const response = await API.postTicket(service_type_id);
      setQrCode(response.qr);
      setTicketNumber(response.ticket_code);
      setServiceId(response.service_id);
      setQueuePosition(response.queue_position);
    } catch (error) {
      console.error("error generating new ticket:", error);
    }
  };


  return(
    <div>
      <h2>Get New Ticket</h2>
      
      {/*1 is passed for testing purposes, it should pass the required service id*/}
      <button onClick={() => newTicket(1)}>Get Ticket</button>

      {ticketNumber && (
        <div>
          <p><strong>Ticket Number:</strong> {ticketNumber}</p>
          <p><strong>Service ID:</strong> {serviceId}</p>
          <p><strong>Queue Position:</strong> {queuePosition}</p>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
    </div>
  )
}

export default TicketComponent;
