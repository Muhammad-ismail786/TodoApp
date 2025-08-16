



-- //////////////////////////////

-- Clear existing data in correct order
SET session_replication_role = replica;

DELETE FROM ratings WHERE TRUE;
DELETE FROM orders WHERE TRUE;
DELETE FROM user_addresses WHERE TRUE;
DELETE FROM payment_methods WHERE TRUE;
DELETE FROM menu_items WHERE TRUE;
DELETE FROM restaurant_customers WHERE TRUE;
DELETE FROM restaurants WHERE TRUE;
DELETE FROM categories WHERE TRUE;
DELETE FROM users WHERE TRUE;

SET session_replication_role = DEFAULT;

-- Reset sequences
ALTER SEQUENCE IF EXISTS categories_category_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS restaurants_restaurant_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS menu_items_item_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS restaurant_customers_customer_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS orders_order_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS payment_methods_payment_method_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS ratings_rating_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS user_addresses_address_id_seq RESTART WITH 1;

-- Insert Users FIRST
INSERT INTO users (username, email, password) VALUES 
('admin', 'admin@example.com', 'password123'),
('john_doe', 'john@example.com', 'hashedpassword1'),
('jane_smith', 'jane@example.com', 'hashedpassword2'),
('mike_wilson', 'mike@example.com', 'hashedpassword3'),
('sarah_connor', 'sarah@example.com', 'hashedpassword4'),
('Ismail', 'ismail@example.com', 'hashedpassword5'),
('alex_jones', 'alex@example.com', 'hashedpassword6'),
('lisa_simpson', 'lisa@example.com', 'hashedpassword7'),
('bob_builder', 'bob@example.com', 'hashedpassword8'),
('mary_jane', 'mary@example.com', 'hashedpassword9'),
('peter_parker', 'peter@example.com', 'hashedpassword10');

-- Insert Payment Methods SECOND
INSERT INTO payment_methods (method_name, method_type, icon_url, is_active) VALUES
('My Wallet', 'wallet', 'https://cdn-icons-png.flaticon.com/128/2489/2489756.png', true),
('PayPal', 'digital', 'https://cdn-icons-png.flaticon.com/128/174/174861.png', true),
('Google Pay', 'digital', 'https://cdn-icons-png.flaticon.com/128/5968/5968120.png', true),
('Apple Pay', 'digital', 'https://cdn-icons-png.flaticon.com/128/825/825454.png', true),
('Cash Money', 'cash', 'https://cdn-icons-png.flaticon.com/128/1611/1611179.png', true),
('Credit/Debit Card', 'card', 'https://cdn-icons-png.flaticon.com/128/633/633611.png', true),
('Stripe', 'digital', 'https://cdn-icons-png.flaticon.com/128/5968/5968144.png', true),
('Bank Transfer', 'bank', 'https://cdn-icons-png.flaticon.com/128/2830/2830284.png', true);

-- Insert User Payment Methods AFTER payment_methods are inserted
INSERT INTO user_payment_methods (user_id, payment_method_id, account_details, is_default, balance, is_active) VALUES
-- User 1 (admin) - Full payment options
(1, 1, '{"wallet_id": "wallet_admin_001"}', false, 1250.75, true),
(1, 2, '{"paypal_email": "admin@example.com"}', false, 0.00, true),
(1, 3, '{"google_account": "admin@example.com"}', true, 0.00, true),
(1, 4, '{"apple_id": "admin@example.com"}', false, 0.00, true),
(1, 5, '{"cash_payment": true}', false, 0.00, true),
(1, 6, '{"card_number": "****1234", "card_type": "visa", "expiry": "12/26"}', false, 0.00, true),

-- User 2 (john_doe) - Main user with $9,379 wallet (matches your UI)
(2, 1, '{"wallet_id": "wallet_john_001"}', true, 9379.00, true),
(2, 2, '{"paypal_email": "john@example.com"}', false, 0.00, true),
(2, 3, '{"google_account": "john@example.com"}', false, 0.00, true),
(2, 4, '{"apple_id": "john@example.com"}', false, 0.00, true),
(2, 5, '{"cash_payment": true}', false, 0.00, true),
(2, 6, '{"card_number": "****3083", "card_type": "mastercard", "expiry": "08/27"}', false, 0.00, true),

-- User 3 (jane_smith) - Moderate wallet balance
(3, 1, '{"wallet_id": "wallet_jane_001"}', true, 456.25, true),
(3, 2, '{"paypal_email": "jane@example.com"}', false, 0.00, true),
(3, 3, '{"google_account": "jane@example.com"}', false, 0.00, true),
(3, 6, '{"card_number": "****5678", "card_type": "visa", "expiry": "03/28"}', false, 0.00, true),

-- User 4 (mike_wilson) - Google Pay preferred
(4, 1, '{"wallet_id": "wallet_mike_001"}', false, 89.50, true),
(4, 3, '{"google_account": "mike@example.com"}', true, 0.00, true),
(4, 5, '{"cash_payment": true}', false, 0.00, true),
(4, 6, '{"card_number": "****9012", "card_type": "amex", "expiry": "11/25"}', false, 0.00, true),

-- User 5 (sarah_connor) - Card preferred
(5, 1, '{"wallet_id": "wallet_sarah_001"}', false, 234.75, true),
(5, 2, '{"paypal_email": "sarah@example.com"}', false, 0.00, true),
(5, 6, '{"card_number": "****3456", "card_type": "visa", "expiry": "06/26"}', true, 0.00, true),

-- User 6 (Ismail) - Mixed options
(6, 1, '{"wallet_id": "wallet_ismail_001"}', true, 567.80, true),
(6, 2, '{"paypal_email": "ismail@example.com"}', false, 0.00, true),
(6, 5, '{"cash_payment": true}', false, 0.00, true),
(6, 6, '{"card_number": "****7890", "card_type": "mastercard", "expiry": "09/27"}', false, 0.00, true),

-- User 7 (alex_jones) - Apple Pay user
(7, 1, '{"wallet_id": "wallet_alex_001"}', false, 123.45, true),
(7, 4, '{"apple_id": "alex@example.com"}', true, 0.00, true),
(7, 5, '{"cash_payment": true}', false, 0.00, true),

-- User 8 (lisa_simpson) - PayPal preferred
(8, 1, '{"wallet_id": "wallet_lisa_001"}', false, 345.60, true),
(8, 2, '{"paypal_email": "lisa@example.com"}', true, 0.00, true),
(8, 6, '{"card_number": "****2468", "card_type": "visa", "expiry": "04/26"}', false, 0.00, true),

-- User 9 (bob_builder) - Cash preferred
(9, 1, '{"wallet_id": "wallet_bob_001"}', false, 78.90, true),
(9, 5, '{"cash_payment": true}', true, 0.00, true),
(9, 6, '{"card_number": "****1357", "card_type": "mastercard", "expiry": "12/25"}', false, 0.00, true),

-- User 10 (mary_jane) - Balanced options
(10, 1, '{"wallet_id": "wallet_mary_001"}', false, 890.25, true),
(10, 2, '{"paypal_email": "mary@example.com"}', true, 0.00, true),
(10, 3, '{"google_account": "mary@example.com"}', false, 0.00, true),
(10, 6, '{"card_number": "****9753", "card_type": "visa", "expiry": "07/28"}', false, 0.00, true),

-- User 11 (peter_parker) - Simple setup
(11, 1, '{"wallet_id": "wallet_peter_001"}', true, 156.75, true),
(11, 3, '{"google_account": "peter@example.com"}', false, 0.00, true),
(11, 5, '{"cash_payment": true}', false, 0.00, true);
-- Insert Categories THIRD
INSERT INTO categories (category_name, category_description, image_url) VALUES
('Hamburger', 'Burgers and fast food chains', 'https://cdn-icons-png.flaticon.com/128/1046/1046784.png'),
('Pizza', 'Pizza restaurants and pizzerias', 'https://cdn-icons-png.flaticon.com/128/3595/3595458.png'),
('Noodles', 'Asian noodles, ramen and pasta', 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png'),
('Meat', 'Steaks, BBQ and grilled meat', 'https://cdn-icons-png.flaticon.com/128/3480/3480618.png'),
('Vegetable', 'Salads, smoothies and healthy food', 'https://cdn-icons-png.flaticon.com/128/1135/1135723.png'),
('Dessert', 'Cakes, ice cream and sweet treats', 'https://cdn-icons-png.flaticon.com/128/3081/3081986.png'),
('Drink', 'Coffee, tea and beverages', 'https://cdn-icons-png.flaticon.com/128/2405/2405479.png'),
('More', 'Mexican, seafood and other cuisines', 'https://cdn-icons-png.flaticon.com/128/2921/2921882.png');

-- Insert User Addresses FOURTH (Complete matching your screenshot + additional)
INSERT INTO user_addresses (user_id, address_type, address_label, street_address, city, state, postal_code, is_default) VALUES
-- User 1 addresses (matching your screenshot exactly)
(1, 'home', 'Home', 'Times Square NYC, Manhattan, 29', 'New York', 'NY', '10036', true),
(1, 'office', 'My Office', '5259 Blue Bill Park, PC 4627', 'New York', 'NY', '10001', false),
(1, 'apartment', 'My Apartment', '2853 Clyde Gallagher, PC 4662', 'New York', 'NY', '10002', false),
(1, 'parent_house', 'Parents House', '6993 Meadow Valley Terrace, PC 36', 'New York', 'NY', '10003', false),
(1, 'villa', 'My Villa', '6830 Southrock Park, PC 5270', 'New York', 'NY', '10004', false),

-- User 2 addresses
(2, 'home', 'Home', '123 Main Street, Block A', 'Karachi', 'Sindh', '75600', true),
(2, 'office', 'Office', '456 Business Center, 5th Floor', 'Karachi', 'Sindh', '75610', false),
(2, 'relative', 'Sister House', '789 Garden Road, Phase 2', 'Karachi', 'Sindh', '75620', false),

-- User 3 addresses
(3, 'home', 'Home Sweet Home', '321 Elm Street, Apt 4B', 'Los Angeles', 'CA', '90210', true),
(3, 'work', 'Work Place', '654 Corporate Blvd, Suite 100', 'Los Angeles', 'CA', '90211', false),
(3, 'gym', 'Gym Location', '987 Fitness Ave, 2nd Floor', 'Los Angeles', 'CA', '90212', false),

-- User 4 addresses
(4, 'home', 'My Home', '159 Oak Avenue, House 25', 'Chicago', 'IL', '60601', true),
(4, 'office', 'Office Building', '753 Business Park, Tower C', 'Chicago', 'IL', '60602', false),

-- User 5 addresses
(5, 'home', 'Home Address', '852 Pine Street, Unit 7', 'Miami', 'FL', '33101', true),
(5, 'beach_house', 'Beach House', '963 Ocean Drive, Villa 12', 'Miami', 'FL', '33139', false),

-- User 6 addresses
(6, 'home', 'Home', '741 Cedar Lane, Apt 3A', 'Seattle', 'WA', '98101', true),
(6, 'office', 'Tech Office', '258 Innovation Way, Building 1', 'Seattle', 'WA', '98102', false);

-- Insert All 32 Restaurants FIFTH
INSERT INTO restaurants (name, address, phone, email, category_id, image_url, min_delivery_time, max_delivery_time, min_order_amount, delivery_fee, average_rating, total_ratings) VALUES
-- Hamburger (category_id = 1) - 4 restaurants
('McDonald''s Downtown', '123 Main Street, Downtown', '0311-1111111', 'downtown@mcdonalds.com', 1, 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&h=300&fit=crop', 20, 35, 15.00, 2.50, 4.3, 175),
('Burger King Plaza', '456 Oak Avenue, Central Plaza', '0311-2222222', 'plaza@burgerking.com', 1, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 25, 40, 12.00, 3.00, 4.1, 142),
('KFC Center', '789 Pine Road, City Center', '0311-3333333', 'center@kfc.com', 1, 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop', 15, 30, 18.00, 2.99, 4.4, 198),
('Subway Express', '321 Elm Street, Express Mall', '0311-4444444', 'express@subway.com', 1, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', 10, 25, 8.00, 1.50, 4.2, 156),

-- Pizza (category_id = 2) - 4 restaurants
('Pizza Hut Deluxe', '654 Maple Drive, Food Court', '0312-1111111', 'deluxe@pizzahut.com', 2, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', 30, 45, 25.00, 3.50, 4.5, 203),
('Domino''s Corner', '987 Cedar Lane, Pizza Corner', '0312-2222222', 'corner@dominos.com', 2, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', 25, 40, 20.00, 2.99, 4.3, 189),
('Papa John''s Fresh', '147 Birch Street, Fresh Plaza', '0312-3333333', 'fresh@papajohns.com', 2, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop', 35, 50, 22.00, 3.25, 4.2, 167),
('Little Caesars Hot', '258 Walnut Road, Hot Spot', '0312-4444444', 'hot@littlecaesars.com', 2, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', 15, 25, 10.00, 1.99, 3.9, 134),

-- Noodles (category_id = 3) - 4 restaurants
('Panda Express', '369 Bamboo Street, Asian Quarter', '0313-1111111', 'express@panda.com', 3, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', 20, 35, 15.00, 2.50, 4.2, 167),
('Noodle Box', '741 Ramen Road, Noodle District', '0313-2222222', 'box@noodle.com', 3, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', 25, 40, 18.00, 3.00, 4.4, 189),
('Chopsticks Palace', '852 Soy Street, Palace Mall', '0313-3333333', 'palace@chopsticks.com', 3, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop', 30, 45, 20.00, 2.75, 4.1, 145),
('Asian Wok', '963 Stir Fry Avenue, Wok Center', '0313-4444444', 'wok@asian.com', 3, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', 18, 32, 16.00, 2.25, 4.3, 178),

-- Meat (category_id = 4) - 4 restaurants
('Steakhouse Supreme', '159 Beef Boulevard, Meat District', '0314-1111111', 'supreme@steakhouse.com', 4, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', 40, 60, 35.00, 4.50, 4.6, 245),
('BBQ Masters', '357 Grill Street, BBQ Quarter', '0314-2222222', 'masters@bbq.com', 4, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop', 35, 50, 30.00, 4.00, 4.4, 198),
('Meat Lovers Paradise', '468 Carnivore Lane, Paradise Mall', '0314-3333333', 'paradise@meatlovers.com', 4, 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop', 45, 65, 40.00, 5.00, 4.5, 223),
('Grill & Chill', '579 Flame Road, Chill Zone', '0314-4444444', 'chill@grill.com', 4, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', 30, 45, 25.00, 3.50, 4.2, 167),

-- Vegetable (category_id = 5) - 4 restaurants
('Green Garden', '680 Veggie Street, Garden District', '0315-1111111', 'garden@green.com', 5, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', 15, 30, 12.00, 2.00, 4.4, 189),
('Healthy Bites', '791 Nutrition Avenue, Health Plaza', '0315-2222222', 'bites@healthy.com', 5, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', 20, 35, 15.00, 2.50, 4.3, 178),
('Salad Bar Plus', '802 Fresh Lane, Salad Center', '0315-3333333', 'plus@saladbar.com', 5, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', 12, 25, 10.00, 1.75, 4.1, 156),
('Smoothie Heaven', '913 Blend Street, Smoothie Zone', '0315-4444444', 'heaven@smoothie.com', 5, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop', 10, 20, 8.00, 1.50, 4.2, 167),

-- Dessert (category_id = 6) - 4 restaurants
('Sweet Dreams Bakery', '124 Sugar Street, Sweet District', '0316-1111111', 'dreams@sweet.com', 6, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop', 25, 40, 18.00, 3.00, 4.5, 234),
('Ice Cream Paradise', '235 Cream Avenue, Paradise Mall', '0316-2222222', 'paradise@icecream.com', 6, 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop', 15, 30, 12.00, 2.25, 4.3, 198),
('Chocolate Factory', '346 Cocoa Road, Factory District', '0316-3333333', 'factory@chocolate.com', 6, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop', 30, 45, 20.00, 3.25, 4.4, 212),
('Cake Corner', '457 Frosting Lane, Corner Bakery', '0316-4444444', 'corner@cake.com', 6, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', 20, 35, 15.00, 2.75, 4.2, 176),

-- Drink (category_id = 7) - 4 restaurants
('Starbucks Central', '568 Coffee Street, Central Plaza', '0317-1111111', 'central@starbucks.com', 7, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop', 10, 20, 5.00, 1.25, 4.4, 289),
('Juice Junction', '679 Fruit Avenue, Junction Mall', '0317-2222222', 'junction@juice.com', 7, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop', 8, 18, 6.00, 1.50, 4.2, 167),
('Tea Time Cafe', '780 Leaf Road, Tea District', '0317-3333333', 'cafe@teatime.com', 7, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop', 12, 25, 7.00, 1.75, 4.3, 198),
('Energy Boost Bar', '891 Vitamin Street, Energy Zone', '0317-4444444', 'bar@energyboost.com', 7, 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop', 5, 15, 4.00, 1.00, 4.1, 145),

-- More (category_id = 8) - 4 restaurants
('Taco Bell Fiesta', '902 Spice Street, Fiesta Plaza', '0318-1111111', 'fiesta@tacobell.com', 8, 'https://images.unsplash.com/photo-1565299585323-38174c4a6cf3?w=400&h=300&fit=crop', 18, 32, 14.00, 2.50, 4.2, 178),
('Sushi Samurai', '013 Fish Avenue, Samurai District', '0318-2222222', 'samurai@sushi.com', 8, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop', 25, 40, 22.00, 3.50, 4.5, 223),
('Indian Spice House', '124 Curry Road, Spice Quarter', '0318-3333333', 'house@indianspice.com', 8, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', 30, 50, 25.00, 3.75, 4.3, 189),
('Mediterranean Magic', '235 Olive Street, Magic Mall', '0318-4444444', 'magic@mediterranean.com', 8, 'https://images.unsplash.com/photo-1544510795-c8ac1457c4e0?w=400&h=300&fit=crop', 35, 55, 28.00, 4.00, 4.4, 201);

-- Insert Comprehensive Menu Items SIXTH
INSERT INTO menu_items (restaurant_id, name, description, price, image_url) VALUES
-- McDonald's Downtown (ID: 1)
(1, 'Big Mac', 'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun', 6.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'),
(1, 'Quarter Pounder with Cheese', 'Quarter pound of 100% fresh beef with cheese, onions, pickles, mustard and ketchup', 7.49, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
(1, 'Chicken McNuggets (10 pc)', 'Tender white meat chicken seasoned to perfection', 4.99, 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop'),
(1, 'McChicken', 'Crispy chicken sandwich with lettuce and mayo', 4.49, 'https://images.unsplash.com/photo-1606755456206-1f6600f364eb?w=400&h=300&fit=crop'),
(1, 'Filet-O-Fish', 'Wild-caught fish filet with tartar sauce and cheese', 5.99, 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop'),
(1, 'French Fries (Large)', 'Golden crispy fries with the perfect amount of salt', 2.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'),

-- Burger King Plaza (ID: 2)
(2, 'Whopper', 'Flame-grilled beef patty with lettuce, tomato, onion, pickles and mayo', 7.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
(2, 'Big King XL', 'Two flame-grilled beef patties with special sauce', 8.49, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'),
(2, 'Chicken Royale', 'Crispy chicken breast with lettuce and mayo', 6.99, 'https://images.unsplash.com/photo-1606755456206-1f6600f364eb?w=400&h=300&fit=crop'),
(2, 'Bacon Double Cheeseburger', 'Two beef patties with bacon and cheese', 7.49, 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop'),
(2, 'Onion Rings', 'Golden crispy onion rings', 3.49, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop'),

-- KFC Center (ID: 3)
(3, 'Original Recipe Chicken (8 pc)', 'Colonel''s secret blend of 11 herbs and spices', 12.99, 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop'),
(3, 'Zinger Burger', 'Spicy chicken fillet with lettuce and spicy mayo', 6.49, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'),
(3, 'Hot & Spicy Wings (6 pc)', 'Crispy wings with hot and spicy coating', 8.99, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop'),
(3, 'Popcorn Chicken', 'Bite-sized pieces of tender chicken', 5.99, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop'),
(3, 'Coleslaw', 'Fresh and crunchy coleslaw', 2.49, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop'),

-- Subway Express (ID: 4)
(4, 'Italian BMT (12 inch)', 'Salami, pepperoni, and ham with cheese and veggies', 8.99, 'https://images.unsplash.com/photo-1555072956-7758afb20e8d?w=400&h=300&fit=crop'),
(4, 'Chicken Teriyaki (12 inch)', 'Oven-roasted chicken with teriyaki sauce', 9.49, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'),
(4, 'Veggie Delite (12 inch)', 'Fresh vegetables and cheese on your choice of bread', 6.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'),
(4, 'Tuna (12 inch)', 'Tuna salad with fresh vegetables', 8.49, 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop'),
(4, 'Cookies (3 pack)', 'Freshly baked chocolate chip cookies', 2.99, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop'),

-- Pizza Hut Deluxe (ID: 5)
(5, 'Pepperoni Pizza (Large)', 'Classic pepperoni with mozzarella cheese', 16.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'),
(5, 'Supreme Pizza (Large)', 'Pepperoni, sausage, mushrooms, peppers, and onions', 19.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'),
(5, 'Meat Lovers Pizza (Large)', 'Pepperoni, sausage, ham, and bacon', 21.99, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop'),
(5, 'Veggie Lovers Pizza (Large)', 'Mushrooms, peppers, onions, olives, and tomatoes', 18.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'),
(5, 'Garlic Bread', 'Fresh baked bread with garlic butter', 4.99, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'),
(5, 'Buffalo Wings (10 pc)', 'Spicy buffalo wings with ranch dip', 9.99, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop'),

-- Continue with more restaurants...
-- Domino's Corner (ID: 6)
(6, 'Margherita Pizza (Medium)', 'Fresh tomatoes, mozzarella, and basil', 14.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'),
(6, 'BBQ Chicken Pizza (Medium)', 'Grilled chicken with BBQ sauce and onions', 17.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'),
(6, 'Hawaiian Pizza (Medium)', 'Ham and pineapple with mozzarella', 16.49, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop'),
(6, 'Cheesy Bread', 'Oven-baked bread topped with cheese', 5.99, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'),
(6, 'Chicken Kickers', 'Seasoned boneless chicken pieces', 7.99, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop'),

-- Papa John's Fresh (ID: 7) - Missing
(7, 'The Works Pizza', 'Pepperoni, sausage, mushrooms, onions, peppers', 16.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'),
(7, 'BBQ Chicken Pizza', 'Grilled chicken with BBQ sauce and onions', 15.49, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'),
(7, 'Garden Fresh Pizza', 'Fresh vegetables and herbs', 13.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'),
(7, 'Garlic Knots', 'Fresh baked garlic knots', 4.99, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'),

-- Little Caesars Hot (ID: 8) - Missing
(8, 'Hot-N-Ready Pepperoni', 'Ready-made pepperoni pizza', 9.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'),
(8, 'Cheese Pizza', 'Classic cheese pizza', 8.99, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop'),
(8, 'Crazy Bread', 'Garlic butter breadsticks', 3.99, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'),
(8, 'Italian Cheese Bread', 'Bread topped with Italian cheese', 5.49, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'),

-- Panda Express (ID: 9)
(9, 'Orange Chicken', 'Crispy chicken with sweet and tangy orange sauce', 8.99, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop'),
(9, 'Beef Broccoli', 'Tender beef with fresh broccoli in savory sauce', 9.49, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop'),
(9, 'Fried Rice', 'Wok-fried rice with eggs and vegetables', 4.99, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'),
(9, 'Chow Mein', 'Stir-fried noodles with vegetables', 5.49, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop'),
(9, 'Spring Rolls (4 pc)', 'Crispy vegetable spring rolls', 3.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'),

-- Noodle Box (ID: 10) - Missing
(10, 'Beef Lo Mein', 'Stir-fried noodles with tender beef', 11.99, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop'),
(10, 'Chicken Pad Thai', 'Traditional Thai noodles with chicken', 10.99, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop'),
(10, 'Vegetable Ramen', 'Japanese noodle soup with vegetables', 9.99, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'),
(10, 'Singapore Rice Noodles', 'Spicy rice noodles with curry flavor', 12.49, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop'),

-- Chopsticks Palace (ID: 11) - Missing  
(11, 'Sweet and Sour Pork', 'Crispy pork with sweet and sour sauce', 13.99, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop'),
(11, 'Kung Pao Chicken', 'Spicy chicken with peanuts and vegetables', 12.99, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop'),
(11, 'Beef and Broccoli', 'Tender beef with fresh broccoli', 11.99, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop'),
(11, 'Hot and Sour Soup', 'Traditional Chinese soup', 4.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'),

-- Asian Wok (ID: 12) - Missing
(12, 'General Tso Chicken', 'Crispy chicken in sweet and spicy sauce', 11.99, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop'),
(12, 'Mongolian Beef', 'Sliced beef with onions and scallions', 13.49, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop'),
(12, 'Vegetable Spring Rolls', 'Crispy rolls filled with vegetables', 5.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'),
(12, 'Wonton Soup', 'Pork wontons in clear broth', 6.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'),

-- Steakhouse Supreme (ID: 13)
(13, 'Ribeye Steak (12 oz)', 'Premium ribeye cooked to perfection', 28.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'),
(13, 'Filet Mignon (8 oz)', 'Tender filet mignon with herb butter', 32.99, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop'),
(13, 'T-Bone Steak (16 oz)', 'Classic T-bone steak grilled to order', 26.99, 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop'),
(13, 'Grilled Salmon', 'Fresh Atlantic salmon with lemon', 22.99, 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop'),
(13, 'Loaded Baked Potato', 'Baked potato with bacon, cheese, and sour cream', 6.99, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop'),


-- BBQ Masters (ID: 14) - Missing
(14, 'BBQ Ribs Platter', 'Full rack of smoky BBQ ribs', 24.99, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop'),
(14, 'Pulled Pork Sandwich', 'Slow-cooked pulled pork with coleslaw', 12.99, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'),
(14, 'Brisket Platter', 'Smoked beef brisket with sides', 19.99, 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop'),
(14, 'BBQ Chicken Wings', 'Smoky wings with BBQ sauce', 11.99, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop'),

-- Meat Lovers Paradise (ID: 15) - Missing
(15, 'Mixed Grill Feast', 'Combination of beef, chicken, and lamb', 29.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'),
(15, 'Lamb Chops', 'Grilled lamb chops with herbs', 26.99, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop'),
(15, 'Beef Kabobs', 'Grilled beef skewers with vegetables', 18.99, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'),
(15, 'Bacon Wrapped Filet', 'Filet mignon wrapped in bacon', 32.99, 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop'),

-- Grill & Chill (ID: 16) - Missing
(16, 'Grilled Chicken Breast', 'Seasoned chicken breast with herbs', 16.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'),
(16, 'Pork Tenderloin', 'Grilled pork with apple glaze', 19.99, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop'),
(16, 'Grilled Vegetables', 'Seasonal vegetables grilled to perfection', 12.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'),
(16, 'Steak Fajitas', 'Sizzling beef fajitas with peppers', 17.99, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'),


-- Green Garden (ID: 17)
(17, 'Caesar Salad', 'Crisp romaine with parmesan and croutons', 9.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'),
(17, 'Greek Salad', 'Fresh vegetables with feta cheese and olives', 10.49, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'),
(17, 'Quinoa Bowl', 'Quinoa with roasted vegetables and tahini', 11.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'),
(17, 'Avocado Toast', 'Multigrain toast with fresh avocado and herbs', 8.99, 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop'),
(17, 'Green Smoothie', 'Spinach, banana, and mango smoothie', 6.99, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop'),

-- Healthy Bites (ID: 18) - Missing
(18, 'Power Bowl', 'Quinoa, grilled chicken, and roasted vegetables', 12.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'),
(18, 'Protein Smoothie', 'Whey protein with berries and banana', 7.99, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop'),
(18, 'Mediterranean Wrap', 'Hummus, vegetables, and feta in whole wheat wrap', 9.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'),
(18, 'Acai Bowl', 'Acai berries with granola and fresh fruit', 10.99, 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop'),
-- Salad Bar Plus (ID: 19) - Missing
(19, 'Build Your Own Salad', 'Choose from 20+ fresh ingredients', 11.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'),
(19, 'Chicken Caesar Salad', 'Grilled chicken over crisp romaine', 10.99, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'),
(19, 'Asian Sesame Salad', 'Mixed greens with sesame dressing', 9.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'),
(19, 'Soup of the Day', 'Fresh daily soup selection', 5.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'),

-- Smoothie Heaven (ID: 20) - Missing
(20, 'Tropical Paradise', 'Mango, pineapple, and coconut smoothie', 6.99, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop'),
(20, 'Berry Blast', 'Mixed berries with yogurt and honey', 6.49, 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop'),
(20, 'Green Machine', 'Spinach, kale, apple, and banana', 7.49, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop'),
(20, 'Protein Power', 'Peanut butter, banana, and protein powder', 8.99, 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop'),

-- Sweet Dreams Bakery (ID: 21)
(21, 'Chocolate Cake Slice', 'Rich chocolate cake with chocolate ganache', 5.99, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop'),
(21, 'Red Velvet Cupcake', 'Classic red velvet with cream cheese frosting', 3.99, 'https://images.unsplash.com/photo-1587736862305-f78b37dd5c39?w=400&h=300&fit=crop'),
(21, 'Apple Pie Slice', 'Traditional apple pie with cinnamon', 4.99, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop'),
(21, 'Tiramisu', 'Classic Italian tiramisu with espresso', 6.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'),
(21, 'Cheesecake Slice', 'New York style cheesecake with berry sauce', 5.49, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop'),
-- Ice Cream Paradise (ID: 22) - Missing
(22, 'Chocolate Sundae', 'Chocolate ice cream with fudge and nuts', 6.99, 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop'),
(22, 'Strawberry Milkshake', 'Fresh strawberries blended with vanilla ice cream', 5.99, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'),
(22, 'Banana Split', 'Classic banana split with three scoops', 8.99, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop'),
(22, 'Ice Cream Sandwich', 'Vanilla ice cream between chocolate cookies', 3.99, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'),

-- Chocolate Factory (ID: 23) - Missing
(23, 'Dark Chocolate Truffle', 'Rich dark chocolate with ganache center', 2.99, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'),
(23, 'Chocolate Lava Cake', 'Warm cake with molten chocolate center', 7.99, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop'),
(23, 'Chocolate Fondue', 'Melted chocolate with fresh fruit', 9.99, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'),
(23, 'Hot Chocolate', 'Rich hot chocolate with whipped cream', 4.99, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'),

-- Cake Corner (ID: 24) - Missing
(24, 'Birthday Cake Slice', 'Vanilla cake with rainbow sprinkles', 4.99, 'https://images.unsplash.com/photo-1587736862305-f78b37dd5c39?w=400&h=300&fit=crop'),
(24, 'Carrot Cake', 'Moist carrot cake with cream cheese frosting', 5.49, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop'),
(24, 'Black Forest Cake', 'Chocolate cake with cherries and cream', 6.99, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop'),
(24, 'Lemon Drizzle Cake', 'Light lemon cake with lemon glaze', 4.49, 'https://images.unsplash.com/photo-1587736862305-f78b37dd5c39?w=400&h=300&fit=crop'),

-- Starbucks Central (ID: 25)
(25, 'Caffè Americano', 'Rich espresso with hot water', 3.45, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop'),
(25, 'Cappuccino', 'Espresso with steamed milk and foam', 4.25, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop'),
(25, 'Caramel Macchiato', 'Espresso with vanilla and caramel', 5.45, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'),
(25, 'Green Tea Latte', 'Matcha green tea with steamed milk', 4.95, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'),
(25, 'Blueberry Muffin', 'Fresh baked muffin with blueberries', 2.95, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop'),
-- Juice Junction (ID: 26) - Missing
(26, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop'),
(26, 'Green Detox Juice', 'Kale, spinach, apple, and ginger', 6.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop'),
(26, 'Carrot Ginger Shot', 'Immune boosting carrot and ginger shot', 2.99, 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop'),
(26, 'Mixed Berry Juice', 'Antioxidant-rich mixed berry blend', 5.99, 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop'),

-- Tea Time Cafe (ID: 27) - Missing
(27, 'Earl Grey Tea', 'Classic bergamot-flavored black tea', 3.49, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'),
(27, 'Chamomile Tea', 'Relaxing herbal chamomile tea', 3.99, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'),
(27, 'Green Tea Latte', 'Matcha green tea with steamed milk', 4.99, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop'),
(27, 'Afternoon Tea Set', 'Selection of teas with scones and pastries', 12.99, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'),

-- Energy Boost Bar (ID: 28) - Missing
(28, 'Pre-Workout Smoothie', 'Banana, caffeine, and energy blend', 7.99, 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop'),
(28, 'Protein Energy Bar', 'Homemade protein bar with nuts and dates', 4.99, 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop'),
(28, 'Vitamin C Boost', 'Orange and vitamin C energy drink', 5.49, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop'),
(28, 'Recovery Smoothie', 'Post-workout protein and berry smoothie', 8.49, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop'),

-- Taco Bell Fiesta (ID: 29)
(29, 'Crunchy Taco Supreme', 'Seasoned beef with lettuce, cheese, and sour cream', 2.99, 'https://images.unsplash.com/photo-1565299585323-38174c4a6c37?w=400&h=300&fit=crop'),
(29, 'Burrito Supreme', 'Large flour tortilla with beef, beans, and fixings', 4.99, 'https://images.unsplash.com/photo-1574343635828-612bb7532861?w=400&h=300&fit=crop'),
(29, 'Quesadilla', 'Grilled tortilla with melted cheese', 3.99, 'https://images.unsplash.com/photo-1594736797933-d0f5e2b15d1e?w=400&h=300&fit=crop'),
(29, 'Nachos Supreme', 'Tortilla chips with cheese, beef, and toppings', 5.49, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop'),
(29, 'Churros', 'Cinnamon sugar churros with chocolate sauce', 2.49, 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=400&h=300&fit=crop'),

-- Sushi Samurai (ID: 30)
(30, 'California Roll (8 pc)', 'Crab, avocado, and cucumber roll', 8.99, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop'),
(30, 'Salmon Nigiri (2 pc)', 'Fresh salmon over seasoned rice', 6.99, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop'),
(30, 'Spicy Tuna Roll (8 pc)', 'Spicy tuna with cucumber and avocado', 9.99, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop'),
(30, 'Miso Soup', 'Traditional soybean soup with tofu', 3.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'),
(30, 'Edamame', 'Steamed soybeans with sea salt', 4.99, 'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop');
-- Indian Spice House (ID: 31) - Missing
(31, 'Chicken Tikka Masala', 'Creamy tomato curry with tender chicken', 14.99, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop'),
(31, 'Biryani Rice', 'Fragrant basmati rice with spices and meat', 13.99, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop'),
(31, 'Naan Bread', 'Traditional Indian flatbread', 3.99, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop'),
(31, 'Lamb Curry', 'Spicy lamb curry with aromatic spices', 16.99, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop'),
(31, 'Samosas (4 pc)', 'Crispy pastries filled with vegetables', 5.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop'),

-- Mediterranean Magic (ID: 32) - Missing
(32, 'Greek Gyros', 'Traditional gyros with tzatziki sauce', 11.99, 'https://images.unsplash.com/photo-1544510795-c8ac1457c4e0?w=400&h=300&fit=crop'),
(32, 'Hummus Platter', 'Fresh hummus with pita and vegetables', 8.99, 'https://images.unsplash.com/photo-1571409021017-b4b84c90dfc2?w=400&h=300&fit=crop'),
(32, 'Falafel Wrap', 'Crispy falafel with vegetables and tahini', 9.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'),
(32, 'Mediterranean Salad', 'Fresh vegetables with feta and olives', 10.99, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'),
(32, 'Baklava', 'Sweet pastry with nuts and honey', 4.99, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop');

-- Insert Restaurant Customers SEVENTH
INSERT INTO restaurant_customers (restaurant_id, name, email, phone) VALUES
(1, 'John Customer', 'john.customer@email.com', '0311-1111111'),
(1, 'Jane Doe', 'jane.doe@email.com', '0311-2222222'),
(2, 'Mike Smith', 'mike.smith@email.com', '0311-3333333'),
(3, 'Sarah Wilson', 'sarah.wilson@email.com', '0311-4444444'),
(5, 'Pizza Lover', 'pizza.lover@email.com', '0312-1111111'),
(9, 'Noodle Fan', 'noodle.fan@email.com', '0313-1111111'),
(13, 'Steak Enthusiast', 'steak.enthusiast@email.com', '0314-1111111'),
(17, 'Health Nut', 'health.nut@email.com', '0315-1111111'),
(21, 'Sweet Tooth', 'sweet.tooth@email.com', '0316-1111111'),
(25, 'Coffee Addict', 'coffee.addict@email.com', '0317-1111111');

-- Insert Sample Orders EIGHTH
INSERT INTO orders (customer_id, restaurant_id, total_amount, status, payment_method_id, payment_status, estimated_delivery_minutes) VALUES
-- Recent orders
(2, 1, 19.97, 'Delivered', 1, 'completed', 25),
(3, 5, 32.98, 'Delivered', 2, 'completed', 30),
(4, 9, 25.97, 'Delivered', 3, 'completed', 28),
(2, 13, 42.97, 'Delivered', 1, 'completed', 35),
(3, 17, 26.97, 'Delivered', 4, 'completed', 22),

-- Current orders
(1, 21, 18.97, 'Preparing', 1, 'completed', 30),
(2, 25, 15.40, 'Confirmed', 2, 'completed', 15),
(3, 29, 21.45, 'Pending', 1, 'pending', 25),
(4, 30, 35.96, 'Out for Delivery', 3, 'completed', 12),
(1, 2, 28.47, 'Preparing', 1, 'completed', 35),

-- Historical orders
(1, 1, 14.47, 'Delivered', 5, 'completed', 22),
(2, 3, 23.97, 'Delivered', 6, 'completed', 28),
(3, 6, 29.98, 'Delivered', 1, 'completed', 32),
(4, 10, 19.48, 'Delivered', 2, 'completed', 26),
(1, 14, 38.99, 'Delivered', 3, 'completed', 45),
(2, 18, 22.47, 'Delivered', 1, 'completed', 20),
(3, 22, 16.98, 'Delivered', 4, 'completed', 25),
(4, 26, 12.44, 'Delivered', 1, 'completed', 18),
(1, 31, 27.96, 'Delivered', 2, 'completed', 40),
(2, 32, 31.97, 'Delivered', 1, 'completed', 38);

-- Insert Ratings NINTH (will automatically update restaurant ratings via trigger)
INSERT INTO ratings (user_id, restaurant_id, rating, review_text) VALUES
-- McDonald's ratings
(2, 1, 4.5, 'Great burgers and fast service!'),
(3, 1, 4.0, 'Good food, sometimes slow delivery'),
(4, 1, 4.5, 'Love the Big Mac, always fresh'),
(1, 1, 4.0, 'Decent fast food option'),

-- Pizza Hut ratings  
(1, 5, 4.5, 'Best pizza in town! Great cheese blend'),
(2, 5, 5.0, 'Amazing Supreme pizza, will order again'),
(3, 5, 4.0, 'Good pizza but delivery was a bit slow'),
(4, 5, 4.5, 'Love the garlic bread too!'),

-- Panda Express ratings
(1, 9, 4.0, 'Orange chicken is delicious'),
(2, 9, 4.5, 'Fresh and tasty Chinese food'),
(3, 9, 4.0, 'Good portions and quick service'),

-- Steakhouse Supreme ratings
(1, 13, 5.0, 'Best steak I have ever had! Premium quality'),
(2, 13, 4.5, 'Excellent ribeye, cooked perfectly'),
(3, 13, 4.0, 'Great food but expensive'),
(4, 13, 5.0, 'Filet mignon was amazing'),

-- Green Garden ratings
(1, 17, 4.5, 'Love the healthy options here'),
(2, 17, 4.0, 'Fresh salads and great smoothies'),
(3, 17, 4.5, 'Perfect for my diet goals'),

-- Sweet Dreams Bakery ratings
(1, 21, 4.5, 'Best chocolate cake ever!'),
(2, 21, 5.0, 'Amazing desserts, highly recommend'),
(3, 21, 4.0, 'Good variety of sweets'),

-- Starbucks ratings
(1, 25, 4.5, 'Perfect coffee every time'),
(2, 25, 4.0, 'Good coffee but sometimes crowded'),
(3, 25, 4.5, 'Love the caramel macchiato'),
(4, 25, 4.0, 'Reliable coffee shop'),

-- More ratings for other restaurants
(1, 2, 4.0, 'Whopper was great'),
(2, 3, 4.5, 'Best fried chicken in the area'),
(3, 4, 4.0, 'Fresh sandwiches, good value'),
(1, 6, 4.5, 'Pizza was hot and delicious'),
(2, 29, 4.0, 'Love the Mexican flavors'),
(3, 30, 4.5, 'Fresh sushi, great quality');

-- Add sample cart items for testing
INSERT INTO cart_items (user_id, menu_item_id, quantity, special_instructions) VALUES
(2, 1, 2, 'Extra spicy please'),
(2, 3, 1, 'No onions'),
(2, 5, 1, NULL),
(3, 2, 1, 'Medium spice level'),
(3, 4, 2, NULL);

-- Add sample cart data with correct schema
INSERT INTO cart_items (customer_id, restaurant_id, item_id, quantity, price, total_price, notes) VALUES
(1, 17, 77, 1, 11.99, 11.99, 'Test item'),
(1, 17, 76, 2, 8.99, 17.98, 'Extra sauce'),
(2, 17, 77, 1, 11.99, 11.99, 'No onions');

-- Final status message
SELECT 'Database seeded successfully with comprehensive data!' as status;

-- Summary of inserted data
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM categories) as total_categories,
  (SELECT COUNT(*) FROM restaurants) as total_restaurants,
  (SELECT COUNT(*) FROM menu_items) as total_menu_items,
  (SELECT COUNT(*) FROM user_addresses) as total_addresses,
  (SELECT COUNT(*) FROM payment_methods) as total_payment_methods,
  (SELECT COUNT(*) FROM orders) as total_orders,
  (SELECT COUNT(*) FROM ratings) as total_ratings,
  (SELECT COUNT(*) FROM restaurant_customers) as total_customers;