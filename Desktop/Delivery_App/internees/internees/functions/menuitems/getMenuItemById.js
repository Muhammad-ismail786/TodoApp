const pool = require("../../database/database");

const getMenuItemById = async (req, res) => {
  const { id } = req.params;

  console.log("=== GET MENU ITEM BY ID ===");
  console.log("Menu Item ID:", id);

  try {
    const result = await pool.query("SELECT * FROM menu_items WHERE item_id = $1", [parseInt(id)]);

    if (result.rows.length === 0) {
      console.log("Menu item not found for ID:", id);
      return res.status(404).json({ message: "Menu item not found" });
    }

    const menuItem = result.rows[0];

    // Convert price to number to match frontend interface
    const response = {
      ...menuItem,
      price: parseFloat(menuItem.price),
    };

    console.log("Menu item found:", response.name, "Price:", response.price);
    res.json(response);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = getMenuItemById;
