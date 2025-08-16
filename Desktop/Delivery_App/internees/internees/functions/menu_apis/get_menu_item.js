// functions/menu_apis/get_menu_items.js

const pool = require("../../database/database");

async function getMenuItems(req, res) {
  try {
    const result = await pool.query("SELECT * FROM menu_items");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = getMenuItems;
