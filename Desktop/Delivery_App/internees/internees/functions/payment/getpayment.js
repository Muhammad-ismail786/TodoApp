// GET /api/users/:userId/payment-methods
async function getUserPaymentMethods(req, res) {
  const userId = req.params.userId;

  const query = `
        SELECT 
            pm.payment_method_id as id,
            COALESCE(upm.display_name, pm.method_name) as name,
            pm.icon_emoji as icon,
            CASE 
                WHEN pm.method_type = 'wallet' AND upm.balance > 0 
                THEN CONCAT('$', REPLACE(upm.balance::text, '.00', ''))
                ELSE ''
            END as balance,
            upm.masked_details,
            upm.is_default,
            pm.method_type
        FROM payment_methods pm
        LEFT JOIN user_payment_methods upm ON pm.payment_method_id = upm.payment_method_id 
            AND upm.user_id = $1
        WHERE pm.is_active = true 
            AND (upm.is_active = true OR upm.user_payment_id IS NULL)
        ORDER BY upm.is_default DESC, pm.method_name;
    `;

  try {
    const result = await db.query(query, [userId]);
    res.json({
      success: true,
      paymentMethods: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payment methods" });
  }
}
