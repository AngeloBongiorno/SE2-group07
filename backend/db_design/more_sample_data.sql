

-- Try format error
INSERT INTO ServiceTypes (name, avg_service_time) 
VALUES 
('Accounts Management', "asdf"); 

-- Try Repetition
INSERT INTO CounterServices (counter_id, service_type_id) 
VALUES 
(3, 3); 

-- Try Format Error
INSERT INTO CounterServices (counter_id, service_type_id) 
VALUES 
(3, "asdf"); 


-- Try Enum Error
INSERT INTO Tickets (service_type_id, queue_position, issued_at, status) 
VALUES 
(2, 1, '2024-10-06 09:05:00', 'waitt');

-- Invalid Date
INSERT INTO DailyQueueStats (counter_id, service_type_id, date, served_count)
VALUES 
(1, 1, '2024-1006', 5), 
