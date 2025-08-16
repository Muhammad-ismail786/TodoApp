// const pool = require("../../database/database");

// class OrderController {
//   // Get user's order history
//   static async getOrderHistory(req, res) {
//     const { userId } = req.params;

//     try {
//       console.log("=== GET ORDER HISTORY ===");
//       console.log("User ID:", userId);

//       // Simple query without the problematic payment method join
//       const query = `
//         SELECT
//           o.order_id,
//           o.customer_id,
//           o.restaurant_id,
//           o.total_amount,
//           o.status,
//           o.created_at,
//           o.updated_at,
//           o.payment_method_id,
//           o.payment_status,
//           o.estimated_delivery_minutes,
//           r.name as restaurant_name,
//           r.image_url as restaurant_image
//         FROM orders o
//         LEFT JOIN restaurants r ON o.restaurant_id = r.restaurant_id
//         WHERE o.customer_id = $1
//         ORDER BY o.created_at DESC
//       `;

//       const result = await pool.query(query, [userId]);
//       console.log("Orders found:", result.rows.length);

//       res.json({
//         success: true,
//         orders: result.rows,
//       });
//     } catch (error) {
//       console.error("Error fetching order history:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch order history",
//         error: error.message,
//       });
//     }
//   }

//   // Create new order
//   static async createOrder(req, res) {
//     const { userId, restaurantId, paymentMethodId, total_amount } = req.body;

//     try {
//       console.log("=== CREATE ORDER ===");
//       console.log("User ID:", userId);
//       console.log("Restaurant ID:", restaurantId);
//       console.log("Payment Method ID:", paymentMethodId);
//       console.log("Total amount:", total_amount);

//       const orderQuery = `
//         INSERT INTO orders (
//           customer_id,
//           restaurant_id,
//           total_amount,
//           status,
//           payment_method_id,
//           payment_status,
//           estimated_delivery_minutes
//         )
//         VALUES ($1, $2, $3, 'pending', $4, 'pending', 30)
//         RETURNING *;
//       `;

//       const result = await pool.query(orderQuery, [
//         userId,
//         restaurantId || 1,
//         total_amount || 25.99,
//         paymentMethodId || 1,
//       ]);

//       res.json({
//         success: true,
//         message: "Order created successfully",
//         order: result.rows[0],
//       });
//     } catch (error) {
//       console.error("Error creating order:", error);
//       res.status(500).json({
//         success: false,
//         message: "Server error",
//         error: error.message,
//       });
//     }
//   }

//   // Get order details
//   static async getOrderDetails(req, res) {
//     const { orderId } = req.params;

//     try {
//       const orderQuery = `
//         SELECT
//           o.*,
//           r.name as restaurant_name,
//           r.address as restaurant_address,
//           u.username as customer_name
//         FROM orders o
//         LEFT JOIN restaurants r ON o.restaurant_id = r.restaurant_id
//         LEFT JOIN users u ON o.customer_id = u.id
//         WHERE o.order_id = $1
//       `;

//       const result = await pool.query(orderQuery, [orderId]);

//       if (result.rows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Order not found",
//         });
//       }

//       res.json({
//         success: true,
//         order: result.rows[0],
//         items: [],
//       });
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch order details",
//       });
//     }
//   }
// }

// module.exports = OrderController;

const pool = require("../../database/database");

class OrderController {
  // Get user's order history
  static async getOrderHistory(req, res) {
    const { userId } = req.params;

    try {
      console.log("=== GET ORDER HISTORY ===");
      console.log("User ID:", userId);

      const query = `
        SELECT 
          o.order_id,
          o.customer_id,
          o.restaurant_id,
          o.total_amount,
          o.status,
          o.created_at,
          o.updated_at,
          o.payment_method_id,
          o.payment_status,
          o.payment_reference,
          o.order_number,
          o.estimated_delivery_minutes,
          r.name as restaurant_name,
          r.image_url as restaurant_image
        FROM orders o
        LEFT JOIN restaurants r ON o.restaurant_id = r.restaurant_id
        WHERE o.customer_id = $1
        ORDER BY o.created_at DESC
      `;

      const result = await pool.query(query, [userId]);
      console.log("✅ Orders found:", result.rows.length);

      res.json({
        success: true,
        orders: result.rows,
        totalOrders: result.rows.length,
      });
    } catch (error) {
      console.error("❌ Error fetching order history:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order history",
        error: error.message,
      });
    }
  }

  // Get order details with items
  static async getOrderDetails(req, res) {
    const { orderId } = req.params;

    try {
      console.log("=== GET ORDER DETAILS ===");
      console.log("Order ID:", orderId);

      // Get order basic info
      const orderQuery = `
        SELECT 
          o.*,
          r.name as restaurant_name,
          r.address as restaurant_address,
          r.image_url as restaurant_image,
          u.username as customer_name
        FROM orders o
        LEFT JOIN restaurants r ON o.restaurant_id = r.restaurant_id
        LEFT JOIN users u ON o.customer_id = u.id
        WHERE o.order_id = $1
      `;

      const orderResult = await pool.query(orderQuery, [orderId]);

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const order = orderResult.rows[0];

      // Try to get order items (if table exists)
      let orderItems = [];
      try {
        const itemsQuery = `
          SELECT 
            oi.*,
            m.name as item_name,
            m.description,
            m.image_url
          FROM order_items oi
          LEFT JOIN menu_items m ON oi.menu_item_id = m.item_id
          WHERE oi.order_id = $1
        `;

        const itemsResult = await pool.query(itemsQuery, [orderId]);
        orderItems = itemsResult.rows;
      } catch (error) {
        console.log("⚠️  Order items table might not exist");
        orderItems = [];
      }

      res.json({
        success: true,
        order: order,
        items: orderItems,
        itemCount: orderItems.length,
      });
    } catch (error) {
      console.error("❌ Error fetching order details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order details",
        error: error.message,
      });
    }
  }

  // Update order status
  static async updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      console.log("=== UPDATE ORDER STATUS ===");
      console.log("Order ID:", orderId);
      console.log("New Status:", status);

      const updateQuery = `
        UPDATE orders 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $2
        RETURNING *
      `;

      const result = await pool.query(updateQuery, [status, orderId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      console.log("✅ Order status updated successfully");

      res.json({
        success: true,
        message: "Order status updated successfully",
        order: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }

  // Get current active orders
  static async getActiveOrders(req, res) {
    const { userId } = req.params;

    try {
      console.log("=== GET ACTIVE ORDERS ===");
      console.log("User ID:", userId);

      const query = `
        SELECT 
          o.*,
          r.name as restaurant_name,
          r.image_url as restaurant_image
        FROM orders o
        LEFT JOIN restaurants r ON o.restaurant_id = r.restaurant_id
        WHERE o.customer_id = $1 
        AND o.status IN ('confirmed', 'preparing', 'on_the_way')
        ORDER BY o.created_at DESC
      `;

      const result = await pool.query(query, [userId]);

      res.json({
        success: true,
        activeOrders: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error("❌ Error fetching active orders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch active orders",
        error: error.message,
      });
    }
  }
}

module.exports = OrderController;
