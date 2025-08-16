// functions/menu_apis/delete_menu_item.js

const pool = require("../../database/database");

async function deleteMenuItem(req, res) {
  const itemId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM menu_items WHERE item_id = $1 RETURNING *", [itemId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully", deletedItem: result.rows[0] });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = deleteMenuItem;
