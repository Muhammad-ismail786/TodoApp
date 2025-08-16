const pool = require("./database/database");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt for:", email); // Debug log

  try {
    // Fetch user from DB
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      console.log("User not found:", email); // Debug log
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User found, comparing passwords..."); // Debug log

    // Compare password using bcrypt
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("Password mismatch for:", email); // Debug log
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful for:", email); // Debug log

    // Success - remove password from response
    const { password: userPassword, ...userData } = user;
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
