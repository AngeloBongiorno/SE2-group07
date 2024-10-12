function TicketComponent(props: any) {

  /*
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
  */


  return(
    <div>
        <div>
          <p><strong>Ticket Number:</strong> {props.ticketNumber}</p>
          <p><strong>Service ID:</strong> {props.serviceId}</p>
          <p><strong>Queue Position:</strong> {props.queuePosition}</p>
          <img src={props.qrCode} alt="QR Code" />
        </div>
    </div>
  )
}

export default TicketComponent;
