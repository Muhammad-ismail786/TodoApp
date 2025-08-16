// const pool = require("./database/database");
//
// module.exports = async (req, res) => {
//   const { user_id, task_id, task_name, date, time, priority, reviews } = req.body;
//   try {
//     await pool.query(
//       "INSERT INTO tasks (user_id, task_id, task_name, date, time, priority, review,) VALUES ($1, $2, $3, $4, $5, $6, $7)",
//       [user_id, task_id, task_name, date, time, priority, reviews]
//     );
//     res.status(200).json({ message: "Task added successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const pool = require("./database/database");

module.exports = async (req, res) => {
  console.log("Incoming task data:", req.body); // Add this line
  const { user_id, title, description, date, time, priority, completed } = req.body;
  try {
    await pool.query(
      "INSERT INTO tasks (user_id, title, description, date, time, priority, completed) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [user_id, title, description, date, time, priority, completed]
    );
    res.status(200).json({ message: "Task added successfully" });
  } catch (err) {
    console.error("Error saving task:", err); // Log error details
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
