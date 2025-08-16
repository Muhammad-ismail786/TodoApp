// const pool = require("../database/database");

// class CartController {
//   // Get cart items
//   static async getCartItems(req, res) {
//     const { userId } = req.params;

//     try {
//       const query = `
//         SELECT
//           c.*,
//           m.name as item_name,
//           m.price,
//           m.description,
//           m.image_url,
//           r.name as restaurant_name,
//           (c.quantity * m.price) as line_total
//         FROM cart_items c
//         JOIN menu_items m ON c.menu_item_id = m.item_id
//         JOIN restaurants r ON m.restaurant_id = r.restaurant_id
//         WHERE c.user_id = $1
//         ORDER BY c.created_at DESC
//       `;

//       const result = await pool.query(query, [userId]);

//       const total = result.rows.reduce((sum, item) => sum + parseFloat(item.line_total), 0);

//       res.json({
//         success: true,
//         cartItems: result.rows,
//         totalAmount: total,
//         itemCount: result.rows.length,
//       });
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch cart items",
//       });
//     }
//   }

//   // Add item to cart
//   static async addToCart(req, res) {
//     const { userId, itemId, quantity = 1 } = req.body;

//     try {
//       // Check if item already exists in cart
//       const existingItem = await pool.query("SELECT * FROM cart_items WHERE user_id = $1 AND item_id = $2", [
//         userId,
//         itemId,
//       ]);

//       if (existingItem.rows.length > 0) {
//         // Update quantity
//         const updateQuery = `
//           UPDATE cart_items
//           SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
//           WHERE user_id = $2 AND item_id = $3
//           RETURNING *
//         `;

//         await pool.query(updateQuery, [quantity, userId, itemId]);
//       } else {
//         // Insert new item
//         const insertQuery = `
//           INSERT INTO cart_items (user_id, menu_item_id, quantity,special_instructions,created_at,updated_at)
//           VALUES ($1, $2, $3,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
//           RETURNING *
//         `;

//         await pool.query(insertQuery, [userId, itemId, quantity]);
//       }

//       res.json({
//         success: true,
//         message: "Item added to cart successfully",
//       });
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to add item to cart",
//       });
//     }
//   }

//   // Update cart item quantity
//   static async updateCartItem(req, res) {
//     const { userId, itemId, quantity } = req.body;

//     try {
//       if (quantity <= 0) {
//         // Remove item if quantity is 0 or less
//         await pool.query("DELETE FROM cart_items WHERE user_id = $1 AND item_id = $2", [userId, itemId]);
//       } else {
//         // Update quantity
//         await pool.query(
//           "UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND item_id = $3",
//           [quantity, userId, itemId]
//         );
//       }

//       res.json({
//         success: true,
//         message: "Cart updated successfully",
//       });
//     } catch (error) {
//       console.error("Error updating cart:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to update cart",
//       });
//     }
//   }

//   // Remove item from cart
//   static async removeFromCart(req, res) {
//     const { userId, itemId } = req.params;

//     try {
//       await pool.query("DELETE FROM cart_items WHERE user_id = $1 AND item_id = $2", [userId, itemId]);

//       res.json({
//         success: true,
//         message: "Item removed from cart successfully",
//       });
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to remove item from cart",
//       });
//     }
//   }

//   // Clear entire cart
//   static async clearCart(req, res) {
//     const { userId } = req.params;

//     try {
//       await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

//       res.json({
//         success: true,
//         message: "Cart cleared successfully",
//       });
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to clear cart",
//       });
//     }
//   }
// }

// module.exports = CartController;

const pool = require("../database/database");

class CartController {
  // Get cart items
  static async getCartItems(req, res) {
    const { userId } = req.params;

    try {
      const query = `
        SELECT 
          c.*,
          m.name as item_name,
          m.price,
          m.description,
          m.image_url,
          r.name as restaurant_name,
          (c.quantity * m.price) as line_total
        FROM cart_items c
        JOIN menu_items m ON c.menu_item_id = m.item_id
        JOIN restaurants r ON m.restaurant_id = r.restaurant_id
        WHERE c.user_id = $1
        ORDER BY c.created_at DESC
      `;

      const result = await pool.query(query, [userId]);

      const total = result.rows.reduce((sum, item) => sum + parseFloat(item.line_total), 0);

      res.json({
        success: true,
        cartItems: result.rows,
        totalAmount: total,
        itemCount: result.rows.length,
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch cart items",
      });
    }
  }

  // Add item to cart
  static async addToCart(req, res) {
    const { userId, itemId, quantity = 1 } = req.body;

    try {
      // Check if item already exists in cart - FIXED: menu_item_id
      const existingItem = await pool.query("SELECT * FROM cart_items WHERE user_id = $1 AND menu_item_id = $2", [
        userId,
        itemId,
      ]);

      if (existingItem.rows.length > 0) {
        // Update quantity - FIXED: menu_item_id
        const updateQuery = `
          UPDATE cart_items 
          SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $2 AND menu_item_id = $3
          RETURNING *
        `;

        await pool.query(updateQuery, [quantity, userId, itemId]);
      } else {
        // Insert new item - FIXED: Added $4 parameter
        const insertQuery = `
          INSERT INTO cart_items (user_id, menu_item_id, quantity, special_instructions, created_at, updated_at)
          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING *
        `;

        await pool.query(insertQuery, [userId, itemId, quantity, ""]);
      }

      res.json({
        success: true,
        message: "Item added to cart successfully",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add item to cart",
      });
    }
  }

  // Update cart item quantity
  static async updateCartItem(req, res) {
    const { userId, itemId, quantity } = req.body;

    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less - FIXED: menu_item_id
        await pool.query("DELETE FROM cart_items WHERE user_id = $1 AND menu_item_id = $2", [userId, itemId]);
      } else {
        // Update quantity - FIXED: menu_item_id
        await pool.query(
          "UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND menu_item_id = $3",
          [quantity, userId, itemId]
        );
      }

      res.json({
        success: true,
        message: "Cart updated successfully",
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update cart",
      });
    }
  }

  // Remove item from cart
  static async removeFromCart(req, res) {
    const { userId, itemId } = req.params;

    try {
      // FIXED: menu_item_id
      await pool.query("DELETE FROM cart_items WHERE user_id = $1 AND menu_item_id = $2", [userId, itemId]);

      res.json({
        success: true,
        message: "Item removed from cart successfully",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({
        success: false,
        message: "Failed to remove item from cart",
      });
    }
  }

  // Clear entire cart
  static async clearCart(req, res) {
    const { userId } = req.params;

    try {
      await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

      res.json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({
        success: false,
        message: "Failed to clear cart",
      });
    }
  }
}

module.exports = CartController;
