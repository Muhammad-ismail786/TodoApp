const express = require("express");
const pool = require("./database/database");

// REGISTRATION APIS
const welcome = require("./functions/welcome");
const signup = require("./functions/signup");
const login = require("./functions/login");

// RESTAURANT APIS
const createRestaurant = require("./functions/restaurant_apis/create_restaurant");
const getRestaurants = require("./functions/restaurant_apis/get_restaurant");
const updateRestaurant = require("./functions/restaurant_apis/update_restaurant");
const deleteRestaurant = require("./functions/restaurant_apis/delete_restaurant");

// CUSTOMER APIS
const restaurant_customers = require("./functions/customers_apis/create_customer");
const getCustomers = require("./functions/customers_apis/get_customer");
const updateCustomer = require("./functions/customers_apis/update_customer");
const deleteCustomer = require("./functions/customers_apis/delete_customer");

// MENU APIS
const createMenuItem = require("./functions/menu_apis/create_menu_item");
const getMenuItems = require("./functions/menu_apis/get_menu_item");
const updateMenuItem = require("./functions/menu_apis/update_menu_item");
const deleteMenuItem = require("./functions/menu_apis/delete_menu_item");

// ORDERS APIS
const createOrder = require("./functions/orders_apis/create_order");
const getOrders = require("./functions/orders_apis/get_order");
const updateOrder = require("./functions/orders_apis/update_order");
const deleteOrder = require("./functions/orders_apis/delete_order");

// CATEGORIES & EXTRA ROUTES
const getCategories = require("./functions/categories/getCategories");
const getRestaurantsByCategoryId = require("./functions/restaurants/getRestaurantsByCategoryId");
const getRestaurentById = require("./functions/categories/getresturentbyid");
const getMenuByRestaurantId = require("./functions/menu/getmenu");

// CART APIS
const addToCart = require("./functions/cart/addtoCart");
const getCart = require("./functions/cart/getCart");
const clearCart = require("./functions/cart/clearCart");

// RATINGS
const addRating = require("./functions/ratings/addRating");

// ORDER CONTROLLER
const OrderController = require("./functions/orders/OrderController");

// ✅ INITIALIZE EXPRESS APP FIRST
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// ✅ NOW DEFINE ALL ROUTES AFTER APP INITIALIZATION

console.log("Setting up API routes...");

// Welcome
app.get("/", welcome);

// Auth
app.post("/users/signup", signup);
app.post("/users/login", login);

// Restaurants
app.post("/restaurants", createRestaurant);
app.get("/restaurants", getRestaurants);
app.put("/restaurants/:id", updateRestaurant);
app.delete("/restaurants/:id", deleteRestaurant);

// Customers
app.post("/customers", restaurant_customers);
app.get("/restaurants/:id/customers", getCustomers);
app.put("/customers/:id", updateCustomer);
app.delete("/customers/:id", deleteCustomer);

// Menu
app.post("/menu", createMenuItem);
app.get("/menu", getMenuItems);
app.put("/menu/:id", updateMenuItem);
app.delete("/menu/:id", deleteMenuItem);
app.get("/menu/:id", getMenuByRestaurantId);

// Orders (function-based)
app.post("/orders", createOrder);
app.get("/orders", getOrders);
app.put("/orders/:id", updateOrder);
app.delete("/orders/:id", deleteOrder);

// Categories
app.get("/categories", getCategories);
app.get("/categories/:categoryId/restaurants", getRestaurantsByCategoryId);

// Restaurant details
app.get("/restaurant/:id", getRestaurentById);
app.get("/restaurents/:id", getRestaurentById);

// Ratings
app.post("/ratings", addRating);

// Cart routes (existing - these work without user ID)
app.post("/cart/add", addToCart);
app.get("/cart", getCart);
app.delete("/cart/clear", clearCart);

// ✅ NEW API CART ROUTES (with user ID support)
app.get("/api/cart/:userId", getCart);
app.post("/api/cart/add", addToCart);
app.delete("/api/cart/:userId/clear", clearCart);

// ✅ NEW ORDER API ROUTES
app.post("/api/orders", createOrder);
app.get("/api/orders/user/:userId", OrderController.getOrderHistory);
app.get("/api/orders/:orderId", OrderController.getOrderDetails);
app.put("/api/orders/:orderId/status", OrderController.updateOrderStatus);
app.get("/api/orders/user/:userId/active", OrderController.getActiveOrders);

// Cart utility routes
app.get("/api/cart/test", (req, res) => {
  res.json({
    success: true,
    message: "Cart API is working!",
    availableEndpoints: [
      "GET /api/cart/:userId - Get cart for specific user",
      "POST /api/cart/add - Add item to cart",
      "DELETE /api/cart/:userId/clear - Clear cart for specific user",
      "GET /cart - Get all cart items (legacy)",
      "POST /cart/add - Add to cart (legacy)",
      "DELETE /cart/clear - Clear all cart (legacy)",
    ],
  });
});

// Orders API Routes (inline)
app.post("/api/orders/create", async (req, res) => {
  try {
    console.log("=== CREATE ORDER ===");
    console.log("Order data:", req.body);

    const { userId, restaurantId, paymentMethodId, total_amount, deliveryAddress, cartItems } = req.body;

    // Create order in database
    const orderQuery = `
      INSERT INTO orders (
        customer_id, restaurant_id, payment_method_id, 
        total_amount, status, payment_status
      ) VALUES ($1, $2, $3, $4, 'pending', 'pending')
      RETURNING order_id, created_at
    `;

    const orderResult = await pool.query(orderQuery, [userId, restaurantId, paymentMethodId, total_amount]);

    const orderId = orderResult.rows[0].order_id;
    console.log("✅ Order created with ID:", orderId);

    res.json({
      success: true,
      message: "Order created successfully",
      order: {
        order_id: orderId,
        created_at: orderResult.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

app.get("/api/orders/:userId/history", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Getting order history for user:", userId);

    const query = `
      SELECT order_id, restaurant_id, total_amount, status, 
             payment_status, created_at
      FROM orders 
      WHERE customer_id = $1 
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Error getting order history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get order history",
    });
  }
});

app.get("/api/orders/:orderId/details", async (req, res) => {
  try {
    const { orderId } = req.params;

    const query = `
      SELECT * FROM orders WHERE order_id = $1
    `;

    const result = await pool.query(query, [orderId]);

    res.json({
      success: true,
      order: result.rows[0] || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order details",
    });
  }
});

// Payment API Routes (inline)
app.get("/api/payments/users/:userId/methods", async (req, res) => {
  try {
    console.log("=== GET PAYMENT METHODS ===");
    console.log("User ID:", req.params.userId);

    // Return default payment methods for now
    res.json({
      success: true,
      paymentMethods: [
        {
          id: "1",
          name: "Cash on Delivery",
          icon: "💵",
          method_type: "cash",
          balance: "",
        },
        {
          id: "2",
          name: "Digital Wallet",
          icon: "💳",
          method_type: "wallet",
          balance: "$100",
        },
        {
          id: "3",
          name: "Credit Card",
          icon: "💳",
          method_type: "card",
          balance: "",
        },
      ],
    });
  } catch (error) {
    console.error("Error getting payment methods:", error);
    res.status(500).json({
      success: false,
      message: "Error getting payment methods",
    });
  }
});

app.post("/api/payments/process", async (req, res) => {
  try {
    console.log("=== PROCESS PAYMENT ===");
    console.log("Payment data:", req.body);

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success
    res.json({
      success: true,
      message: "Payment processed successfully",
      paymentStatus: "completed",
      transactionReference: `TXN_${Date.now()}`,
      canProceedToDelivery: true,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      paymentStatus: "failed",
    });
  }
});

// Address API Routes (inline)
app.get("/api/addresses/users/:userId", async (req, res) => {
  try {
    console.log("Getting addresses for user:", req.params.userId);

    res.json({
      success: true,
      addresses: [
        {
          id: "1",
          label: "Home",
          address: "Times Square NYC, Manhattan",
          city: "New York, NY 10036",
        },
        {
          id: "2",
          label: "My Office",
          address: "5259 Blue Bill Park",
          city: "Pittsburgh, PA 4627",
        },
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting addresses",
    });
  }
});

app.post("/api/addresses/add", async (req, res) => {
  res.json({ success: true, message: "Address added successfully" });
});

app.put("/api/addresses/:addressId/default", async (req, res) => {
  res.json({ success: true, message: "Default address updated" });
});

app.put("/api/addresses/:addressId", async (req, res) => {
  res.json({ success: true, message: "Address updated successfully" });
});

app.delete("/api/addresses/:addressId", async (req, res) => {
  res.json({ success: true, message: "Address deleted successfully" });
});

console.log("✅ All API routes configured");

// Additional optional routes
try {
  app.get("/restaurant-menu/:id", require("./functions/restaurants/getRestaurantWithMenu"));
} catch (err) {
  console.log("Optional route not available: getRestaurantWithMenu");
}

try {
  app.get("/api/menu-item/:id", require("./functions/menuitems/getMenuItemById"));
} catch (err) {
  console.log("Optional route not available: getMenuItemById");
}

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📱 Available API endpoints:`);
  console.log(`   - POST /api/orders - Create new order`);
  console.log(`   - GET /api/cart/:userId - Get user cart`);
  console.log(`   - GET /api/payments/users/:userId/methods - Get payment methods`);
  console.log(`   - GET /api/addresses/users/:userId - Get user addresses`);
});
