const pool = require("../../database/database");

async function updateOrder(req, res) {
  const orderId = req.params.id;
  const { customer_id, restaurant_id, total_amount, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE orders
       SET customer_id = $1,
           restaurant_id = $2,
           total_amount = $3,
           status = $4
       WHERE order_id = $5
       RETURNING *`,
      [customer_id, restaurant_id, total_amount, status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = updateOrder;
