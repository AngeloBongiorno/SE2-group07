Database Tables

**Counters**

counter_id (INT, Primary Key, Auto Increment): Counter number.
name (VARCHAR): Name/Description of the counter.

**ServiceTypes**

service_type_id (INT, Primary Key, Auto Increment): Service type ID.
name (VARCHAR): Tag name of the service type (e.g., Shipping, Deposit).
avg_service_time (INT): Average service time (in minutes) for the service type.

**CounterServices**

counter_service_id (INT, Primary Key, Auto Increment): Counter-service mapping ID.
counter_id (Foreign Key -> Counters.counter_id): Reference to the counter.
service_type_id (Foreign Key -> ServiceTypes.service_type_id): Reference to the service type.
This table establishes the relationship between counters and the services they can handle.


**Tickets**

ticket_id (INT, Primary Key, Auto Increment): Unique ticket number.
service_type_id (Foreign Key -> ServiceTypes.service_type_id): Type of service requested by the customer.
queue_position (INT): Position in the queue.
issued_at (TIMESTAMP): Time the ticket was issued.
called_at (TIMESTAMP, NULLABLE): Time the ticket was called for service.
status (ENUM('waiting', 'called', 'served')): Status of the ticket.


**DailyQueueStats**

stat_id (INT, Primary Key, Auto Increment): Stat record ID.
counter_id (Foreign Key -> Counters.counter_id): Counter ID.
service_type_id (Foreign Key -> ServiceTypes.service_type_id): Service type ID.
date (DATE): Date of the statistic.
served_count (INT): Number of customers served by the counter for the service type on that day.


***Logic***

**Queue Management:**

Each service type has its own queue (Tickets table).
When a new customer arrives, they are issued a ticket, and their position is recorded (queue_position).
When a counter is available, the system checks the CounterServices table to find which services the counter can handle and chooses the first customer from the longest queue.
After serving, the ticket status is updated to "served," and the system updates the queue length on the display.


**Statistics:**

Track how many customers were served per counter and per service type on a daily basis, as well as the total served customers.
This data is stored in the DailyQueueStats table and can be used for reports and analysis.


**Explanation of Tables:**

**--** 
Counters: Stores the counters available in the office (e.g., Counter 1, Counter 2).
ServiceTypes: Stores the different types of services (e.g., Deposit, Shipping) and their average service time.
CounterServices: Links the counters to the service types they can handle.
Tickets: Tracks the tickets issued to customers, including queue position and status.
DailyQueueStats: Tracks the statistics for served tickets, organized by date, counter, and service type.
**--**