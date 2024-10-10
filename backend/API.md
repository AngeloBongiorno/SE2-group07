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
