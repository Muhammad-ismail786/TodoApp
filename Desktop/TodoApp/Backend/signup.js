// const pool = require("./database/database");
// const bcrypt = require("bcrypt");

// module.exports = async (req, res) => {
//   const { username, password } = req.body; // ✅ Destructure 'username', not 'fullName'

//   console.log("🔍 Signup attempt:", { username, password: "***" });

//   try {
//     // Validate input
//     if (!username || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if user already exists
//     const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);

//     if (existingUser.rows.length > 0) {
//       console.log("❌ User already exists:", email);
//       return res.status(409).json({ message: "User already exists with this email" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("✅ Password hashed successfully");

//     // Insert new user - use 'username' not 'fullName'
//     const result = await pool.query(
//       "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, email, created_at",
//       [username, hashedPassword] // ✅ Use 'username' variable
//     );

//     console.log("🎉 User created successfully:", result.rows[0]);

//     res.status(201).json({
//       message: "User created successfully",
//       user: result.rows[0],
//     });
//   } catch (error) {
//     console.error("💥 Signup error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const pool = require("./database/database");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("🔍 Signup attempt:", { username, email, password: "***" });

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email.toLowerCase(), hashedPassword]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
