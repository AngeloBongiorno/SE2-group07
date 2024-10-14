


const URL = "http://localhost:3001/officequeue/"

async function nextCustomer(counter_id: string) {
    const response = await fetch(URL+'nextCustomer', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ counter_id: counter_id })
    })
    if(response.ok){
        console.log(response.json())
    }
    else {
        const errDetail = await response.json();
        if (errDetail.error)
            throw errDetail.error
        if (errDetail.message)
            throw errDetail.message
        throw new Error("Error. Please reload the page")
    }
}

const API = {
    nextCustomer
}

export default API