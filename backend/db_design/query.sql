-- CREATE DATABASE office_queue_management;
-- USE office_queue_management;

-- Create the Counters table
CREATE TABLE Counters (
    counter_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create the ServiceTypes table
CREATE TABLE ServiceTypes (
    service_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avg_service_time INT NOT NULL -- In minutes
);

-- Create the CounterServices table to map counters and the services they provide
CREATE TABLE CounterServices (
    counter_service_id INT AUTO_INCREMENT PRIMARY KEY,
    counter_id INT NOT NULL,
    service_type_id INT NOT NULL,
    FOREIGN KEY (counter_id) REFERENCES Counters(counter_id) ON DELETE CASCADE,
    FOREIGN KEY (service_type_id) REFERENCES ServiceTypes(service_type_id) ON DELETE CASCADE
);

-- Create the Tickets table to store ticket information
CREATE TABLE Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    service_type_id INT NOT NULL,
    queue_position INT NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP NULL, -- Will be filled when the ticket is called
    status INT DEFAULT 0,
    FOREIGN KEY (service_type_id) REFERENCES ServiceTypes(service_type_id) ON DELETE CASCADE
);

-- Create the DailyQueueStats table to track statistics of served tickets
CREATE TABLE DailyQueueStats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    counter_id INT NOT NULL,
    service_type_id INT NOT NULL,
    date DATE NOT NULL,
    served_count INT DEFAULT 0,
    FOREIGN KEY (counter_id) REFERENCES Counters(counter_id) ON DELETE CASCADE,
    FOREIGN KEY (service_type_id) REFERENCES ServiceTypes(service_type_id) ON DELETE CASCADE
);
