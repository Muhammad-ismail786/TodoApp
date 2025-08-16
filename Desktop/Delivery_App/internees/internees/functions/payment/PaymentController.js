const pool = require("../../database/database");

class PaymentController {
  // ...existing methods...

  // ✅ NEW: Process payment before moving to delivery
  static async processPayment(req, res) {
    const { userId, paymentMethodId, amount, orderId, cartItems } = req.body;

    try {
      console.log("=== PROCESS PAYMENT ===");
      console.log("Payment data:", { userId, paymentMethodId, amount, orderId });

      await pool.query("BEGIN");

      // Get payment method details
      const paymentMethodQuery = `
        SELECT pm.*, upm.balance, upm.user_payment_id
        FROM payment_methods pm
        LEFT JOIN user_payment_methods upm ON pm.payment_method_id = upm.payment_method_id
          AND upm.user_id = $1
        WHERE pm.payment_method_id = $2 AND pm.is_active = true
      `;

      const paymentResult = await pool.query(paymentMethodQuery, [userId, paymentMethodId]);

      if (paymentResult.rows.length === 0) {
        await pool.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: "Invalid payment method",
        });
      }

      const paymentMethod = paymentResult.rows[0];
      console.log("Payment method:", paymentMethod.method_name, paymentMethod.method_type);

      // Handle different payment types
      let paymentStatus = "pending";
      let transactionId = null;

      if (paymentMethod.method_type === "wallet") {
        // ✅ Wallet Payment - Immediate processing
        if (!paymentMethod.balance || parseFloat(paymentMethod.balance) < parseFloat(amount)) {
          await pool.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            message: "Insufficient wallet balance",
            currentBalance: paymentMethod.balance || 0,
            requiredAmount: amount,
          });
        }

        // Deduct from wallet
        await pool.query(
          `UPDATE user_payment_methods 
           SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $2 AND payment_method_id = $3`,
          [amount, userId, paymentMethodId]
        );

        paymentStatus = "completed";
        console.log("✅ Wallet payment processed successfully");
      } else if (paymentMethod.method_type === "card") {
        // ✅ Card Payment - Simulate processing
        paymentStatus = await simulateCardPayment(paymentMethod, amount);
        console.log("💳 Card payment status:", paymentStatus);
      } else if (paymentMethod.method_name.toLowerCase().includes("paypal")) {
        // ✅ PayPal Payment - Simulate processing
        paymentStatus = await simulatePayPalPayment(paymentMethod, amount);
        console.log("💰 PayPal payment status:", paymentStatus);
      } else if (paymentMethod.method_name.toLowerCase().includes("google")) {
        // ✅ Google Pay - Simulate processing
        paymentStatus = await simulateGooglePayPayment(paymentMethod, amount);
        console.log("📱 Google Pay payment status:", paymentStatus);
      } else {
        // ✅ Other payment methods
        paymentStatus = "pending";
        console.log("⏳ Payment marked as pending for manual processing");
      }

      // Create transaction record
      const transactionQuery = `
        INSERT INTO payment_transactions (
          order_id, user_payment_method_id, amount, transaction_status, 
          transaction_type, transaction_reference, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING transaction_id
      `;

      const transactionRef = `TXN_${orderId}_${Date.now()}`;
      const transactionResult = await pool.query(transactionQuery, [
        orderId,
        paymentMethod.user_payment_id,
        amount,
        paymentStatus,
        "payment",
        transactionRef,
      ]);

      transactionId = transactionResult.rows[0].transaction_id;

      // Update order if exists
      if (orderId) {
        await pool.query(
          `UPDATE orders 
           SET payment_status = $1, payment_method_id = $2, updated_at = CURRENT_TIMESTAMP
           WHERE order_id = $3`,
          [paymentStatus, paymentMethodId, orderId]
        );
      }

      await pool.query("COMMIT");

      // ✅ Return detailed payment result
      res.json({
        success: true,
        message: "Payment processed successfully",
        paymentStatus: paymentStatus,
        transactionId: transactionId,
        transactionReference: transactionRef,
        paymentMethod: {
          id: paymentMethod.payment_method_id,
          name: paymentMethod.method_name,
          type: paymentMethod.method_type,
        },
        canProceedToDelivery: paymentStatus === "completed",
        nextStep: paymentStatus === "completed" ? "delivery" : "waiting_for_confirmation",
      });
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error("❌ Error processing payment:", error);
      res.status(500).json({
        success: false,
        message: "Payment processing failed",
        error: error.message,
      });
    }
  }

  // ...existing methods...
}

// ✅ Payment simulation functions
async function simulateCardPayment(paymentMethod, amount) {
  // Simulate card processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  return success ? "completed" : "failed";
}

async function simulatePayPalPayment(paymentMethod, amount) {
  // Simulate PayPal processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate 98% success rate
  const success = Math.random() > 0.02;
  return success ? "completed" : "failed";
}

async function simulateGooglePayPayment(paymentMethod, amount) {
  // Simulate Google Pay processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate 97% success rate
  const success = Math.random() > 0.03;
  return success ? "completed" : "failed";
}

module.exports = PaymentController;
