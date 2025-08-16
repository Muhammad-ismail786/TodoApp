// functions/menu_apis/update_menu_item.js

const pool = require("../../database/database");

async function updateMenuItem(req, res) {
  const itemId = req.params.id;
  const { name, description, price } = req.body;

  try {
    const result = await pool.query(
      `UPDATE menu_items 
       SET name = $1, description = $2, price = $3, updated_at = CURRENT_TIMESTAMP
       WHERE item_id = $4
       RETURNING *`,
      [name, description, price, itemId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating menu item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = updateMenuItem;
