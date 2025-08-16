const pool = require("../../database/database");

const getRestaurantWithMenu = async (req, res) => {
  const { id } = req.params;

  console.log("=== GET RESTAURANT WITH MENU ===");
  console.log("Restaurant ID:", id);

  try {
    // Get restaurant details (simplified - no categories join)
    const restaurantResult = await pool.query(`SELECT * FROM restaurants WHERE restaurant_id = $1`, [parseInt(id)]);

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Get menu items for this restaurant
    const menuResult = await pool.query(`SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY item_id`, [
      parseInt(id),
    ]);

    console.log("Restaurant found:", restaurantResult.rows[0].name);
    console.log("Menu items found:", menuResult.rows.length);

    // Convert menu items price to numbers
    const menuItems = menuResult.rows.map((item) => ({
      ...item,
      price: parseFloat(item.price),
    }));

    const response = {
      restaurant: restaurantResult.rows[0],
      menuItems: menuItems,
    };

    console.log("Sending response with menu items:", menuItems.length);
    res.json(response);
  } catch (error) {
    console.error("Error fetching restaurant with menu:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = getRestaurantWithMenu;
