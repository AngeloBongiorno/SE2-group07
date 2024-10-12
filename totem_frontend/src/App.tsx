import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TicketComponent from './components/TicketComponent'
import SelectorComponent from './components/SelectorComponent'
import API from './API'

function App() {

  const [services, setServices] = useState<any>([]);
  const [selectedService, setSelectedService] = useState<any>();
  const [qrCode, setQrCode] = useState<string | undefined>();
  const [ticketNumber, setTicketNumber] = useState<number | undefined>();
  const [serviceId, setServiceId] = useState<number | undefined>();
  const [queuePosition, setQueuePosition] = useState<number | undefined>();

  // for now it only fetches available services once (component load time)
  // might consider to update them when some condition is triggered
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await API.getServices();
        setServices(response);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService !== undefined) {
      const fetchTicket = async () => {
        try {
          const response = await API.postTicket(selectedService.service_id);
          setQrCode(response.qr);
          setTicketNumber(response.ticket_code);
          setServiceId(response.service_id);
          setQueuePosition(response.queue_position);
        } catch (error) {
          console.error("error generating new ticket:", error);
        } 
      };
      fetchTicket();
    }
  }, [selectedService]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Totem Frontend</h1>
      {selectedService && <TicketComponent ticketNumber={ticketNumber} serviceId={serviceId} queuePosition={queuePosition} qrCode={qrCode}/>}
      <SelectorComponent services={services} setSelectedService={setSelectedService}/>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
