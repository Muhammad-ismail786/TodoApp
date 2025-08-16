const pool = require("../../database/database");

// Function to update a customer
async function updateCustomer(req, res) {
  const customerId = req.params.id;
  const { name, email, phone } = req.body;

  try {
    const result = await pool.query(
      "UPDATE restaurant_customers SET name = $1, email = $2, phone = $3, updated_at = NOW() WHERE customer_id = $4 RETURNING *",
      [name, email, phone, customerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = updateCustomer;
