// functions/menu_apis/create_menu_item.js

const pool = require("../../database/database");

async function createMenuItem(req, res) {
  const { restaurant_id, name, description, price } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO menu_items (restaurant_id, name, description, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [restaurant_id, name, description, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating menu item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = createMenuItem;
