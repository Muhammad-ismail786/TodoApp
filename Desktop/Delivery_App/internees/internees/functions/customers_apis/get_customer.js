// functions/customers_apis/delete_customer.js

const pool = require("../../database/database");

async function deleteCustomer(req, res) {
  const customerId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM restaurant_customers WHERE customer_id = $1 RETURNING *", [
      customerId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = deleteCustomer;
