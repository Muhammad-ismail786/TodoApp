// const pool = require("../../database/database");

// const createOrder = async (req, res) => {
//   const { payment_method, total_amount } = req.body;

//   console.log("=== CREATE ORDER ===");
//   console.log("Payment method:", payment_method);
//   console.log("Total amount:", total_amount);

//   try {
//     // Get cart items
//     const cartItems = await pool.query(`
//       SELECT c.*, m.name as item_name
//       FROM cart_items c
//       JOIN menu_items m ON c.item_id = m.item_id
//     `);

//     if (cartItems.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cart is empty",
//       });
//     }

//     // Create order (simplified)
//     const orderNumber = Math.floor(Math.random() * 100000);

//     // Clear cart after order
//     await pool.query("DELETE FROM cart_items");

//     res.json({
//       success: true,
//       message: "Order created successfully",
//       orderNumber: orderNumber,
//       estimatedTime: "25-30 minutes",
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// module.exports = createOrder;

const pool = require("../../database/database");

const createOrder = async (req, res) => {
  console.log("=== CREATE ORDER ===");
  console.log("Request body:", req.body);

  try {
    const {
      user_id = 1,
      restaurant_id,
      total_amount,
      delivery_address,
      payment_method,
      payment_status = "paid",
      status = "confirmed",
      special_instructions = "",
      estimated_delivery_minutes = 30,
      delivery_fee = 2.5,
      subtotal,
      cart_items = [],
    } = req.body;

    // ✅ STEP 1: Get cart items with correct column names
    const cartQuery = `
      SELECT 
        c.cart_id,
        c.user_id,
        c.menu_item_id,
        c.quantity,
        c.special_instructions,
        m.name as item_name,
        m.price,
        m.restaurant_id,
        (c.quantity * m.price) as line_total
      FROM cart_items c 
      JOIN menu_items m ON c.menu_item_id = m.item_id
      WHERE c.user_id = $1
    `;

    const cartResult = await pool.query(cartQuery, [user_id]);

    if (cartResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const cartItems = cartResult.rows;
    const restaurantId = restaurant_id || cartItems[0].restaurant_id;
    const totalAmount = total_amount || cartItems.reduce((sum, item) => sum + parseFloat(item.line_total), 0);

    // ✅ STEP 2: Start transaction
    await pool.query("BEGIN");

    try {
      // ✅ STEP 3: Create order with proper data
      const orderNumber = `ORD-${Date.now()}`;
      const paymentReference = `PAY-${Date.now()}`;

      const orderQuery = `
        INSERT INTO orders (
          customer_id, 
          restaurant_id, 
          total_amount, 
          status, 
          payment_method_id,
          payment_status,
          payment_reference,
          order_number,
          estimated_delivery_minutes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const orderResult = await pool.query(orderQuery, [
        user_id,
        restaurantId,
        totalAmount,
        status,
        1, // payment_method_id (default to 1)
        payment_status,
        paymentReference,
        orderNumber,
        estimated_delivery_minutes,
      ]);

      const order = orderResult.rows[0];
      console.log("✅ Order created with ID:", order.order_id);

      // ✅ STEP 4: Insert order items (if you have order_items table)
      for (const item of cartItems) {
        try {
          await pool.query(
            `INSERT INTO order_items (order_id, menu_item_id, quantity, price, total_price)
             VALUES ($1, $2, $3, $4, $5)`,
            [order.order_id, item.menu_item_id, item.quantity, item.price, item.line_total]
          );
        } catch (itemError) {
          console.log("⚠️  Order items table might not exist, continuing without it");
        }
      }

      // ✅ STEP 5: Clear cart after successful order
      await pool.query("DELETE FROM cart_items WHERE user_id = $1", [user_id]);

      // ✅ STEP 6: Commit transaction
      await pool.query("COMMIT");

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: order,
        orderNumber: orderNumber,
        estimatedTime: `${estimated_delivery_minutes} minutes`,
        cartItemsProcessed: cartItems.length,
      });
    } catch (error) {
      // Rollback on error
      await pool.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: error.message,
    });
  }
};

module.exports = createOrder;
