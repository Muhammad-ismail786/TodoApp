-- Insert Users FIRST
INSERT INTO users (username, email, password) VALUES 
('admin', 'admin@example.com', 'password123'),
('john_doe', 'john@example.com', 'hashedpassword1'),
('jane_smith', 'jane@example.com', 'hashedpassword2'); -- Remove the comma here

INSERT INTO category (category_name, category_icon, category_color) VALUES
('Work', 'briefcase', '#A259FF'),
('Personal', 'user', '#FFB74D'),
('Shopping', 'shopping-cart', '#4CAF50'),
('Health', 'heartbeat', '#E57373'),
('Study', 'book', '#2196F3');