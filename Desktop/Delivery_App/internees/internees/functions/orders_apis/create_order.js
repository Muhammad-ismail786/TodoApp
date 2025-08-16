const pool = require("../../database/database");

async function createOrder(req, res) {
  const { restaurant_id, customer_id, total_amount, status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO orders (restaurant_id, customer_id, total_amount, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [restaurant_id, customer_id, total_amount, status || "pending"]
    );

    res.status(201).json({
      message: "Order created successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = createOrder;
