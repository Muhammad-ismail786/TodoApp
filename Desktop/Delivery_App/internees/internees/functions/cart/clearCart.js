// const pool = require("../../database/database");

// const clearCart = async (req, res) => {
//   console.log("=== CLEAR CART ===");

//   try {
//     // Get userId from route parameters
//     const userId = req.params.userId;

//     let query;
//     let queryParams = [];

//     if (userId) {
//       // Clear cart for specific customer - FIXED to match your schema
//       query = `DELETE FROM cart_items WHERE customer_id = $1`;
//       queryParams = [userId];
//       console.log("Clearing cart for customer:", userId);
//     } else {
//       // Clear all cart items (legacy support)
//       query = `DELETE FROM cart_items`;
//       queryParams = [];
//       console.log("Clearing all cart items");
//     }

//     const result = await pool.query(query, queryParams);

//     console.log("Cart cleared. Items removed:", result.rowCount);

//     res.json({
//       success: true,
//       message: userId ? `Cart cleared for customer ${userId}` : "All cart items cleared",
//       itemsRemoved: result.rowCount,
//       userId: userId ? parseInt(userId) : null,
//     });
//   } catch (error) {
//     console.error("Error clearing cart:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// module.exports = clearCart;

// const pool = require("../../database/database");

// const clearCart = async (req, res) => {
//   console.log("=== CLEAR CART ===");

//   try {
//     const userId = req.params.userId;

//     let query;
//     let queryParams = [];

//     if (userId) {
//       // FIXED: Use user_id instead of customer_id
//       query = `DELETE FROM cart_items WHERE user_id = $1`;
//       queryParams = [userId];
//       console.log("Clearing cart for user:", userId);
//     } else {
//       query = `DELETE FROM cart_items`;
//       queryParams = [];
//       console.log("Clearing all cart items");
//     }

//     const result = await pool.query(query, queryParams);

//     console.log("Cart cleared. Items removed:", result.rowCount);

//     res.json({
//       success: true,
//       message: userId ? `Cart cleared for user ${userId}` : "All cart items cleared",
//       itemsRemoved: result.rowCount,
//       userId: userId ? parseInt(userId) : null,
//     });
//   } catch (error) {
//     console.error("Error clearing cart:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// module.exports = clearCart;

const pool = require("../../database/database");

const clearCart = async (req, res) => {
  console.log("=== CLEAR CART ===");

  try {
    // Get userId from route parameters
    const userId = req.params.userId;

    let query;
    let queryParams = [];

    if (userId) {
      // ✅ FIXED: Use user_id instead of customer_id to match your schema
      query = `DELETE FROM cart_items WHERE user_id = $1`;
      queryParams = [userId];
      console.log("Clearing cart for user:", userId);
    } else {
      // Clear all cart items (legacy support)
      query = `DELETE FROM cart_items`;
      queryParams = [];
      console.log("Clearing all cart items");
    }

    const result = await pool.query(query, queryParams);

    console.log("Cart cleared. Items removed:", result.rowCount);

    res.json({
      success: true,
      message: userId ? `Cart cleared for user ${userId}` : "All cart items cleared",
      itemsRemoved: result.rowCount,
      userId: userId ? parseInt(userId) : null,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = clearCart;
