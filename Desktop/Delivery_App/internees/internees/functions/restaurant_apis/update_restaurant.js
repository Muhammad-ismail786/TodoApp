const pool = require("../../database/database");

const updateRestaurant = async (req, res) => {
  const restaurantId = req.params.id;
  const { name, address, phone, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE restaurants
       SET name = $1,
           address = $2,
           phone = $3,
           email = $4,
           updated_at = NOW()
       WHERE restaurant_id = $5
       RETURNING *`,
      [name, address, phone, email, restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateRestaurant;
