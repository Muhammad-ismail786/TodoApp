const pool = require("../../database/database");

const getCart = async (req, res) => {
  console.log("=== GET CART ===");

  try {
    const { userId } = req.params;

    console.log("Getting cart for user/customer:", userId || "all users");

    const query = `
      SELECT 
        c.cart_id,
        c.user_id,
        c.menu_item_id,
        c.quantity,
        c.special_instructions,
        c.created_at,
        c.updated_at,
        m.name as item_name,
        m.price,
        m.description,
        m.image_url,
        r.name as restaurant_name,
        r.restaurant_id,
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
    console.error("Error fetching cart:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      position: error.position,
    });

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = getCart;
