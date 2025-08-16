CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    category_description VARCHAR(200) NOT NULL,
    image_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    category_id INT NOT NULL,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    total_ratings INT DEFAULT 0,
    min_delivery_time INT DEFAULT 20,
    max_delivery_time INT DEFAULT 40,
    min_order_amount DECIMAL(10,2) DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE IF NOT EXISTS ratings (
    rating_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, restaurant_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS menu_items (
    item_id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

CREATE TABLE IF NOT EXISTS restaurant_customers (
    customer_id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

-- Create payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL,
    method_type VARCHAR(20) NOT NULL,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user payment methods table to store user's saved payment methods and wallet balances
CREATE TABLE IF NOT EXISTS user_payment_methods (
    user_payment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    payment_method_id INTEGER REFERENCES payment_methods(payment_method_id) ON DELETE CASCADE,
    account_details JSONB, -- stores card numbers, wallet IDs, etc.
    is_default BOOLEAN DEFAULT false,
    balance DECIMAL(10,2) DEFAULT 0.00, -- for wallet types
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, payment_method_id)
);
-- Add this to your schema
CREATE TABLE IF NOT EXISTS cart_items (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(item_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, menu_item_id)
);
-- Payment transactions for tracking all payments
CREATE TABLE IF NOT EXISTS payment_transactions (
    transaction_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    user_payment_method_id INTEGER REFERENCES user_payment_methods(user_payment_id),
    amount DECIMAL(10,2) NOT NULL,
    transaction_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_type VARCHAR(20) DEFAULT 'payment', -- payment, refund
    payment_gateway_response JSONB,
    transaction_reference VARCHAR(100),
    processing_fee DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for payment transactions
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_payment_method ON payment_transactions(user_payment_method_id);

-- Add index for cart items
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_menu_item_id ON cart_items(menu_item_id);
-- Add index for user payment methods
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON user_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_active ON user_payment_methods(is_active);
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(255) NOT NULL,
    payment_method_id INTEGER,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_reference VARCHAR(100),
    order_number VARCHAR(20) UNIQUE,
    estimated_delivery_minutes INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id)
);

-- Create user addresses table (NEW)
CREATE TABLE IF NOT EXISTS user_addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    address_type VARCHAR(50) NOT NULL,
    address_label VARCHAR(100) NOT NULL,
    street_address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Pakistan',
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants 
    SET 
        average_rating = (
            SELECT ROUND(AVG(rating), 1) 
            FROM ratings 
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
        ),
        total_ratings = (
            SELECT COUNT(*) 
            FROM ratings 
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_restaurant_rating ON ratings;
CREATE TRIGGER trigger_update_restaurant_rating
    AFTER INSERT OR UPDATE OR DELETE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_restaurant_rating();

-- Function to auto-generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD' || LPAD(NEW.order_id::text, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ratings_restaurant_id ON ratings(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_category_id ON restaurants(category_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_active ON user_addresses(is_active);

-- Drop and recreate cart_items table with correct schema
DROP TABLE IF EXISTS cart_items CASCADE;

CREATE TABLE cart_items (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(item_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, menu_item_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_menu_item_id ON cart_items(menu_item_id);

-- Insert sample cart data for testing
INSERT INTO cart_items (user_id, menu_item_id, quantity, special_instructions) VALUES
(2, 1, 2, 'Extra spicy please'),
(2, 3, 1, 'No onions'),
(2, 5, 1, NULL),
(3, 2, 1, 'Medium spice level'),
(3, 4, 2, NULL),
(1, 1, 1, 'Test order for admin'),
(1, 6, 1, NULL);

-- Run this in Beekeeper Studio or psql
ALTER TABLE cart_items ADD COLUMN customer_id INTEGER;

-- Copy user_id values to customer_id
UPDATE cart_items SET customer_id = user_id;