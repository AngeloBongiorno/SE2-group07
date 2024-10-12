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


const API = { postTicket };
export default API;
