const pool = require("../../database/database");

const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM orders WHERE order_id = $1 RETURNING *", [orderId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = deleteOrder;
