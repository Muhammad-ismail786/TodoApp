const pool = require("../../database/database");

const createRestaurant = async (req, res) => {
  const { name, address, phone, email } = req.body;

  if (!name || !address || !phone || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO restaurants (name, address, phone, email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, address, phone, email]
    );

    res.status(201).json({ message: "Restaurant created", restaurant: result.rows[0] });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = createRestaurant;
