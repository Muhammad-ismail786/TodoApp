const pool = require("../../database/database");

const addRating = async (req, res) => {
  const { user_id, restaurant_id, rating, review_text } = req.body;

  console.log("=== ADD RATING ===");
  console.log("Data:", { user_id, restaurant_id, rating, review_text });

  try {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const result = await pool.query(
      `INSERT INTO ratings (user_id, restaurant_id, rating, review_text)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, restaurant_id) 
       DO UPDATE SET 
         rating = EXCLUDED.rating,
         review_text = EXCLUDED.review_text,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [user_id, restaurant_id, rating, review_text]
    );

    console.log("Rating saved:", result.rows[0]);
    res.json({ message: "Rating saved successfully", rating: result.rows[0] });
  } catch (err) {
    console.error("Error adding rating:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = addRating;
