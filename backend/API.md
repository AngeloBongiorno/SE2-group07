## API List

For all success scenarios, always assume a `200` status code for the API response.  
For requests with wrong format, use a `400` error code, or better a `WrongFormatError`.  
For generic errors, use a `500` error code, or better a `GenericError` object.  
Specific error scenarios will have their corresponding error code.  

CORS methods to use: GET, DELETE, POST (for adding new things -- NOT idempotent), PUT (for updating things -- idempotent)

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