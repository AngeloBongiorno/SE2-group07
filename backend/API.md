## API List

For all success scenarios, always assume a `200` status code for the API response.  
For requests with wrong format, use a `400` error code, or better a `WrongFormatError`.  
For generic errors, use a `500` error code, or better a `GenericError` object.  
Specific error scenarios will have their corresponding error code.  

CORS methods to use: GET, DELETE, POST (for adding new things -- NOT idempotent), PUT (for updating things -- idempotent)

### STATIC API

#### GET `/ticketPdfs/ticketId.pdf`

Static route needed for customers to download their ticket in pdf format.

- Request Parameters: A ticket id in form of `ticketId.pdf`
- Request Body Content: None
- Response Body Content: `application/pdf`
- Access Constraints: None
- Additional Constraints:
  - Returns a 404 if no Ticket pdf is available

### Call Customer API

#### GET `callCustomer`

Fetches an array of TicketToShow objects, so that the waiting display can show who the next customer at a counter is.  

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of `TicketToShow` objects
  - Example: `[{ticketId: 343, serviceType: 1, counterId: 4, called_at: "10:09:27"}, {...}]`
- Access Constraints: None
- Additional Constraints:
  - Returns a 404 if no new TicketToShow is available (i.e. the ticketToShow table is empty)

#### DELETE `callCustomer`
Removes the successfully displayed customers from the corresponding table in the database (ticketToShow table), so that they are not displayed again by error.

- Request Parameters: None
- Request Body Content: An array of `ticketId` integers
  - Example: `[343, 300, 351]`
- Response Body Content: None
- Access Constraints: None
- Additional Constraints:
  - Returns a 404 if no ticketId was matched, i.e. either the ticket was never in the table or it has already been removed

#### Example of a request with parameters -- (don't delete until finalization pls)
xxxxx

- Request Parameters:
  - `username`: a string that must not be empty
  - Example: `ezelectronics/users/Admin`
- Request Body Content: An object with the following attributes:
  - `name`: a string that must not be empty
  - `surname`: a string that must not be empty
  - `address`: a string that must not be empty
  - `birthdate`: a string that represents a date in the format **YYYY-MM-DD**. It must not be empty
  - Example: `{name: "admin", surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "01/01/1970"}`
- Response Body Content: A **User** object representing the updated user
  - Example: `{username: "Admin", name: "admin", surname: "admin", role: "Manager", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "01/01/1970"}`
- Access Constraints: None
- Additional Constraints:
  - xxx


### Get Ticket

### Get Available Services

#### GET `/services`

Fetches a list of available services that customers can choose from.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of `Service` objects
  - Example: 
    ```json
    [
      {
        "service_id": 1,
        "service_name": "Shipping",
        "avg_service_time": 10
      },
      {
        "service_id": 2,
        "service_name": "Accounts Management",
        "avg_service_time": 7
      }
    ]
    ```
- Access Constraints: None
- Additional Constraints: None

### Get Ticket

#### POST `/ticket`

Generates a unique ticket for a customer based on the selected service type.

- Request Parameters: None
- Request Body Content:
  - `service_id`: The ID of the selected service type.
  - Example:
    ```json
    {
      "service_id": 1
    }
    ```
- Response Body Content: A `Ticket` object containing the unique ticket code, queue position and qr code in base64.
  - Example:
    ```json
    {
      "ticket_code": "A001",
      "service_id": 1,
      "queue_position": 5,
      "qr": base64 string,
    }
    ```
- Access Constraints: None
- Additional Constraints: None

### Get Queue Status

#### GET `/queue/status`

Returns the status of all service queues, including the number of people waiting for each service.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: A list of `QueueStatus` objects
  - Example:
    ```json
    {
      "queues": [
        {
          "service_id": 1,
          "queue_length": 4
        },
        {
          "service_id": 2,
          "queue_length": 2
        }
      ]
    }
    ```
- Access Constraints: None
- Additional Constraints: None

### Estimate Waiting Time

#### GET `/queue/estimate-time`

Estimates the waiting time for a given ticket based on the current queue conditions.

- Request Parameters: None
- Request Body Content:
  - `ticket_code`: The code of the ticket for which the waiting time is estimated.
  - Example:
    ```json
    {
      "ticket_code": "A001"
    }
    ```
- Response Body Content: A `WaitingTime` object
  - Example:
    ```json
    {
      "estimated_wait_time": "15:50"
    }
    ```
- Access Constraints: None
- Additional Constraints: None

### Next Customer API

#### GET `nextCustomer`

 API to find the next customer that has to be served and it sets the ticket as called.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: the next that is going to be served
  - Example: `{
    "ticket_id": 4,
    "service_type_id": 1,
    "queue_position": 1,
    "issued_at": "2024-10-14 15:45:45",
    "called_at": "2024-10-14 15:46:39",
    "status": "called"
}`
- Access Constraints: None
- Additional Constraints:
  - 