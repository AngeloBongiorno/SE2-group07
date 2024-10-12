const postTicket = async (service_type_id: number) => {
    const requestUrl = `http://localhost:3001/ticket`;
    return await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({service_type_id: service_type_id})
    })
        .then(response => response.json())
        .catch(() => {
            return null;
        })
}

const getServices = async () => {
    const requestUrl = `http://localhost:3001/services`;

    return await fetch(requestUrl)
        .then(response => response.json())
        .catch((error) => {
          console.error("Error fetching services:", error)
        }
        );
}




const API = { postTicket, getServices };
export default API;
