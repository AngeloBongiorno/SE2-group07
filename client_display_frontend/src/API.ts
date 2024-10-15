

const getCallCustomer = async () => {
  try {
    const requestUrl = `http://localhost:3001/officequeue/callCustomer`;
    const response = await fetch(requestUrl);
    if (!response.ok) {
            if (response.status === 404) {
                console.error('No new TicketToShow available (404 Not Found)');
                return [];
            }
            throw new Error('Network response was not ok: ' + response.statusText);
    }
    const ticketToShowArray = await response.json();
    console.log('Fetched TicketToShow objects:', ticketToShowArray);
    return ticketToShowArray;
  } catch(error) {
    console.error('Error fetching TicketToShow objects:', error);
        return [];
  }
}


const deleteCallCustomer = async (ticketIds: number[]) => {
  try {
    const requestUrl = `http://localhost:3001/officequeue/callCustomer`;
    const response = await fetch(requestUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketIds)
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.error('No ticketId matched (404 Not Found)');
        return; // Exit the function if no ticketId matched
      }
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    console.log('Successfully removed customers:', ticketIds);
  } catch(error) {
    console.error('Error deleting customers', error);
  }
}

const API = { getCallCustomer, deleteCallCustomer };
export default API;
