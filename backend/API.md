## API List

For all success scenarios, always assume a `200` status code for the API response. For requests with wrong format, always assume a `400` error code.
Specific error scenarios will have their corresponding error code.  

CORS methods to use: GET, DELETE, POST (for adding new things -- NOT idempotent), PUT (for updating things -- idempotent)

### Call Customer API

#### GET `callCustomer`

Fetches an array of TicketToShow objects, so that the "waiting area display" can update each counter's currently served customer's ID, if one of the TicketToShow fetched is relative to that counter.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of `TicketToShow` objects
  - Example: `[{ticketId: 343, serviceType: 1, counterId: 4, called_at: "10:09:27"}, {...}]`
- Access Constraints: None
- Additional Constraints:
  - Returns a 404 if no new TicketToShow is available (i.e. the tickets_to_show table is empty)
  - Returns a 500 for generic errors

#### Example of a request with parameters --
xxxxx

- Request Parameters: Example: `ezelectronics/users/Admin`
  - `username`: a string that must not be empty
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