-- Insert sample counters
INSERT INTO Counters (name) 
VALUES 
('Counter 1'), 
('Counter 2'), 
('Counter 3');

-- Insert sample service types
INSERT INTO ServiceTypes (name, avg_service_time) 
VALUES 
('Deposit', 5),   
('Shipping', 10), 
('Accounts Management', 7); 

-- Insert sample counter-service relationships (which counters handle which services)
INSERT INTO CounterServices (counter_id, service_type_id) 
VALUES 
(1, 1), 
(1, 2), 
(2, 1), 
(2, 3), 
(3, 2), 
(3, 3); 

-- Insert sample tickets (queue positions)
INSERT INTO Tickets (service_type_id, queue_position, issued_at, status) 
VALUES 
(2, 1, '2024-10-06 09:05:00', 'waiting'),   
(1, 2, '2024-10-06 09:10:00', 'waiting'),   
(3, 1, '2024-10-06 09:15:00', 'waiting'),   
(1, 3, '2024-10-06 09:20:00', 'waiting'),   
(2, 2, '2024-10-06 09:25:00', 'waiting');   

-- Insert sample daily queue stats for tracking served customers (assuming some have been served)
INSERT INTO DailyQueueStats (counter_id, service_type_id, date, served_count)
VALUES 
(1, 1, '2024-10-06', 5),  
(1, 2, '2024-10-06', 3),  
(2, 1, '2024-10-06', 2),  
(2, 3, '2024-10-06', 4);  
