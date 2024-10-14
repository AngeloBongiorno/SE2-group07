-- Create the Counters table
CREATE TABLE Counters (
    counter_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Create the ServiceTypes table
CREATE TABLE ServiceTypes (
    service_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avg_service_time INTEGER NOT NULL -- In minutes
);

-- Create the CounterServices table to map counters and the services they provide
CREATE TABLE CounterServices (
    counter_service_id INTEGER PRIMARY KEY AUTOINCREMENT ,
    counter_id INTEGER NOT NULL,
    service_type_id INTEGER NOT NULL,
    FOREIGN KEY (counter_id) REFERENCES Counters(counter_id) ON DELETE CASCADE,
    FOREIGN KEY (service_type_id) REFERENCES ServiceTypes(service_type_id) ON DELETE CASCADE
);

-- Create the Tickets table to store ticket information
CREATE TABLE Tickets (
    ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_type_id INTEGER NOT NULL,
    queue_position INTEGER NOT NULL,
    issued_at TEXT DEFAULT CURRENT_TIMESTAMP,
    called_at TEXT NULL, -- Will be filled when the ticket is called
    status TEXT CHECK(status IN ('waiting', 'called', 'served')) DEFAULT 'waiting',
    FOREIGN KEY (service_type_id) REFERENCES ServiceTypes(service_type_id) ON DELETE CASCADE
);

-- Create the DailyQueueStats table to track statistics of served tickets
CREATE TABLE DailyQueueStats (
    stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    counter_id INTEGER NOT NULL,
    service_type_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    served_count INTEGER DEFAULT 0,
    FOREIGN KEY (counter_id) REFERENCES Counters(counter_id) ON DELETE CASCADE,
    FOREIGN KEY (service_type_id) REFERENCES ServiceTypes(service_type_id) ON DELETE CASCADE
);

-- Create the TicketsToShow table to display ticket information
CREATE TABLE TicketsToShow (
    ticket_id INTEGER PRIMARY KEY,
    service_type_id INTEGER NOT NULL,
    counter_id INTEGER NOT NULL,
    called_at TEXT NOT NULL, -- Time the ticket was called for service
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (service_type_id) REFERENCES ServiceTypes(service_type_id) ON DELETE CASCADE,
    FOREIGN KEY (counter_id) REFERENCES Counters(counter_id) ON DELETE CASCADE
);  
