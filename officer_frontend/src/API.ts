


const URL = "http://localhost:3001/officequeue/"

async function nextCustomer(counter_id: string) {
    const response = await fetch(URL+'nextCustomer')
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