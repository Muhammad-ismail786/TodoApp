const pool = require("../../database/database");

const getMenuByRestaurantId = async (req, res) => {
  const { id } = req.params;

  console.log("=== GET MENU BY RESTAURANT ID ===");
  console.log("Restaurant ID:", id);

  try {
    const result = await pool.query(`SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY category, name`, [
      parseInt(id),
    ]);

    console.log("Menu items found:", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getMenuByRestaurantId;
