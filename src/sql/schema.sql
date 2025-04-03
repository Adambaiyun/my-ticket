CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(50) UNIQUE NOT NULL,
    total_ticket_num INT NOT NULL,
    available_ticket_num INT NOT NULL,
    booked_ticket_num INT NOT NULL,
    start_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);