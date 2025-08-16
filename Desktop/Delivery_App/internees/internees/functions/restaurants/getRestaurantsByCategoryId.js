const pool = require("../../database/database");

const getRestaurantsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log("🔍 Fetching restaurants for category ID:", categoryId);

    if (!categoryId || categoryId === "undefined" || isNaN(parseInt(categoryId))) {
      console.error("❌ Invalid category ID:", categoryId);
      return res.status(400).json({
        message: "Invalid category ID",
        error: "Category ID must be a valid number",
      });
    }

    const numericCategoryId = parseInt(categoryId);

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
        COALESCE(r.average_rating, 4.0) as average_rating,
        COALESCE(r.total_ratings, 100) as total_ratings,
        COALESCE(r.min_delivery_time, 25) as min_delivery_time,
        COALESCE(r.max_delivery_time, 35) as max_delivery_time,
        COALESCE(r.min_order_amount, 15.00) as min_order_amount,
        COALESCE(r.delivery_fee, 2.99) as delivery_fee
      FROM restaurants r
      JOIN categories c ON r.category_id = c.category_id
      WHERE r.category_id = $1
      ORDER BY r.average_rating DESC, r.total_ratings DESC`,
      [numericCategoryId]
    );

    console.log("✅ Query result:", result.rows.length, "restaurants found");

    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    // After the SQL query, ensure numeric conversion:
    const restaurantsWithNumbers = result.rows.map((restaurant) => ({
      ...restaurant,
      average_rating: Number(restaurant.average_rating),
      total_ratings: Number(restaurant.total_ratings),
      min_delivery_time: Number(restaurant.min_delivery_time),
      max_delivery_time: Number(restaurant.max_delivery_time),
      min_order_amount: Number(restaurant.min_order_amount),
      delivery_fee: Number(restaurant.delivery_fee),
    }));

    res.json(restaurantsWithNumbers);
  } catch (err) {
    console.error("💥 Error fetching restaurants:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = getRestaurantsByCategoryId;
