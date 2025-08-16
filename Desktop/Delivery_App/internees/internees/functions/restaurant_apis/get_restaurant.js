const pool = require("../../database/database");

const getRestaurants = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurants ORDER BY restaurant_id DESC");
    res.status(200).json({ restaurants: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getRestaurants;
