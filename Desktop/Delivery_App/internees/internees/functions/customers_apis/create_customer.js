// Import your database pool
const pool = require("../../database/database"); // Adjust the path as needed

// Function to create a new customer
async function restaurant_customers(req, res) {
  const { restaurant_id, name, email, phone } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO restaurant_customers (restaurant_id, name, email, phone) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [restaurant_id, name, email, phone]
    );
    res.status(201).json({ message: "custumer created", costumer: result.rows[0] });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = restaurant_customers;
