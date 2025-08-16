const express = require("express");
const addTask = require("./addtask");
const signup = require("./signup");
const login = require("./login");
const pool = require("./database/database");

// ✅ INITIALIZE EXPRESS APP FIRST
const app = express();
const PORT = process.env.PORT || 3000;

// Only enable JSON middleware
app.use(express.json());

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Main router for tasks
const router = express.Router();

// Add a new task
router.post("/tasks", addTask);

// Get all tasks (for index screen)
router.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get a single task by id
router.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a task
router.put("/tasks/:id", async (req, res) => {
  const { title, description, date, time, priority, completed } = req.body;
  try {
    await pool.query(
      "UPDATE tasks SET title=$1, description=$2, date=$3, time=$4, priority=$5, completed=$6 WHERE id=$7",
      [title, description, date, time, priority, completed, req.params.id]
    );
    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a task
router.delete("/tasks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Attach router
app.use("/", router);

// Auth routes
app.post("/users/signup", signup);
app.post("/users/login", login);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`   - POST /users/signup`);
  console.log(`   - POST /users/login`);
  console.log(`   - GET /tasks`);
  console.log(`   - POST /tasks`);
  console.log(`   - PUT /tasks/:id`);
  console.log(`   - DELETE /tasks/:id`);
});
