// functions/orders_apis/get_orders.js

const pool = require("../../database/database");

async function getOrders(req, res) {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = getOrders;
