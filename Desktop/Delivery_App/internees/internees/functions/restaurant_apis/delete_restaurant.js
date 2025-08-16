const pool = require("../../database/database"); // Ensure your DB connection

async function deleteRestaurant(req, res) {
  const { id } = req.params;

  try {
    // Check if restaurant exists
    const checkQuery = "SELECT * FROM restaurants WHERE restaurant_id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Start transaction
    await pool.query("BEGIN");

    // Delete related orders
    const deleteOrdersQuery = "DELETE FROM orders WHERE restaurant_id = $1";
    await pool.query(deleteOrdersQuery, [id]);

    // Delete the restaurant
    const deleteRestaurantQuery = "DELETE FROM restaurants WHERE restaurant_id = $1";
    await pool.query(deleteRestaurantQuery, [id]);

    // Commit transaction
    await pool.query("COMMIT");

    res.status(200).json({ message: "Restaurant and related orders deleted successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error deleting restaurant:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = deleteRestaurant;
