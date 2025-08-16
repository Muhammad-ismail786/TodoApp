const pool = require("../../database/database");

const getRestaurentById = async (req, res) => {
  const { id } = req.params;

  console.log("=== GET RESTAURANT BY ID ===");
  console.log("Restaurant ID:", id);

  try {
    const result = await pool.query(
      `SELECT 
        r.restaurant_id,
        r.name,
        r.address,
        r.phone,
        r.email,
        r.category_id,
        c.category_name,
        r.image_url,
        r.average_rating,
        r.total_ratings,
        r.min_delivery_time,
        r.max_delivery_time,
        r.min_order_amount,
        r.delivery_fee
      FROM restaurants r
      LEFT JOIN categories c ON r.category_id = c.category_id
      WHERE r.restaurant_id = $1`,
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      console.log("No restaurant found with ID:", id);
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurant = result.rows[0];
    console.log("Restaurant found:", restaurant);

    res.json(restaurant);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = getRestaurentById;
