// const pool = require("../database/database");
// const bcrypt = require("bcrypt");

// module.exports = async (req, res) => {
//   console.log("API IS BEEN HIT !!!");
//   const { fullName, email, password } = req.body;
//   console.log("BODY -", fullName, email, password);
//   try {
//     // Check if user already exists
//     const check = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (check.rows.length > 0) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user to DB
//     const result = await pool.query("INSERT INTO users (fullName, email, password) VALUES ($1, $2, $3) RETURNING *", [
//       fullName,
//       email,
//       hashedPassword,
//     ]);
//     const user = result.rows[0];
//     res.status(201).json({ message: "User registered", user });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const pool = require("../database/database");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  const { username, email, password } = req.body; // ✅ Destructure 'username', not 'fullName'

  console.log("🔍 Signup attempt:", { username, email, password: "***" });

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);

    if (existingUser.rows.length > 0) {
      console.log("❌ User already exists:", email);
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed successfully");

    // Insert new user - use 'username' not 'fullName'
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email.toLowerCase(), hashedPassword] // ✅ Use 'username' variable
    );

    console.log("🎉 User created successfully:", result.rows[0]);

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("💥 Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



