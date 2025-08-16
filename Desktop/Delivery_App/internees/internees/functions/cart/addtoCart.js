// const pool = require("../../database/database");

// const addToCart = async (req, res) => {
//   console.log("=== ADD TO CART ===");
//   console.log("Request body:", req.body);

//   // Handle different field name formats from frontend
//   const {
//     user_id,
//     userId,
//     customer_id,
//     customerId,
//     menu_item_id,
//     menuItemId,
//     item_id, // ✅ Your frontend sends this
//     itemId,
//     restaurant_id,
//     restaurantId,
//     quantity,
//     special_instructions,
//     specialInstructions,
//     notes,
//     price,
//   } = req.body;

//   // Determine the actual values, checking multiple possible field names
//   const actualUserId = user_id || userId || customer_id || customerId || 1; // ✅ Default to user 1 for testing
//   const actualMenuItemId = menu_item_id || menuItemId || item_id || itemId; // ✅ Now handles item_id
//   const actualRestaurantId = restaurant_id || restaurantId;
//   const actualQuantity = quantity || 1;
//   const actualNotes = special_instructions || specialInstructions || notes || "";
//   const actualPrice = price;

//   console.log("Processed data:", {
//     actualUserId,
//     actualMenuItemId,
//     actualRestaurantId,
//     actualQuantity,
//     actualNotes,
//     actualPrice,
//   });

//   try {
//     // ✅ ENHANCED: Better validation with more details
//     if (!actualUserId || !actualMenuItemId || !actualRestaurantId) {
//       console.log("❌ Validation failed:", {
//         hasUserId: !!actualUserId,
//         hasMenuItemId: !!actualMenuItemId,
//         hasRestaurantId: !!actualRestaurantId,
//       });

//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//         required: ["user_id (or userId)", "menu_item_id (or item_id)", "restaurant_id"],
//         received: {
//           user_id: actualUserId,
//           menu_item_id: actualMenuItemId,
//           restaurant_id: actualRestaurantId,
//           quantity: actualQuantity,
//         },
//         originalBody: req.body,
//       });
//     }

//     // ✅ ENHANCED: Better menu item validation
//     console.log("🔍 Looking up menu item ID:", actualMenuItemId);
//     const menuItemQuery = await pool.query("SELECT * FROM menu_items WHERE item_id = $1", [actualMenuItemId]);

//     if (menuItemQuery.rows.length === 0) {
//       console.log("❌ Menu item not found:", actualMenuItemId);
//       return res.status(400).json({
//         success: false,
//         message: "Menu item not found",
//         menu_item_id: actualMenuItemId,
//       });
//     }

//     const menuItemDetails = menuItemQuery.rows[0];
//     const itemPrice = actualPrice || menuItemDetails.price;

//     // ✅ ENHANCED: Validate price is a valid number
//     if (!itemPrice || isNaN(parseFloat(itemPrice))) {
//       console.log("❌ Invalid price:", itemPrice);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid price",
//         price: itemPrice,
//       });
//     }

//     // Calculate total price
//     const totalPrice = parseFloat(itemPrice) * parseInt(actualQuantity);

//     console.log("📋 Adding to cart:", {
//       item: menuItemDetails.name,
//       user: actualUserId,
//       restaurant: actualRestaurantId,
//       quantity: actualQuantity,
//       price: itemPrice,
//       total: totalPrice,
//     });

//     // Check if item already exists in cart for this customer
//     const existingItem = await pool.query(
//       `SELECT * FROM cart_items WHERE customer_id = $1 AND item_id = $2 AND restaurant_id = $3`,
//       [actualUserId, actualMenuItemId, actualRestaurantId]
//     );

//     let result;

//     if (existingItem.rows.length > 0) {
//       // Update existing item quantity and total price
//       const newQuantity = existingItem.rows[0].quantity + parseInt(actualQuantity);
//       const newTotalPrice = parseFloat(itemPrice) * newQuantity;

//       console.log("🔄 Updating existing cart item from quantity", existingItem.rows[0].quantity, "to", newQuantity);

//       result = await pool.query(
//         `UPDATE cart_items
//          SET quantity = $1, total_price = $2, notes = $3
//          WHERE cart_id = $4
//          RETURNING *`,
//         [newQuantity, newTotalPrice, actualNotes, existingItem.rows[0].cart_id]
//       );

//       console.log("✅ Updated existing cart item:", menuItemDetails.name, "New quantity:", newQuantity);
//     } else {
//       // Insert new item
//       console.log("➕ Inserting new cart item");

//       result = await pool.query(
//         `INSERT INTO cart_items (customer_id, restaurant_id, item_id, quantity, price, total_price, notes)
//          VALUES ($1, $2, $3, $4, $5, $6, $7)
//          RETURNING *`,
//         [actualUserId, actualRestaurantId, actualMenuItemId, actualQuantity, itemPrice, totalPrice, actualNotes]
//       );

//       console.log("✅ Added new item to cart:", menuItemDetails.name);
//     }

//     // ✅ ENHANCED: Better response with more details
//     const response = {
//       success: true,
//       message: "Item added to cart successfully",
//       cartItem: {
//         ...result.rows[0],
//         item_name: menuItemDetails.name,
//         item_description: menuItemDetails.description,
//       },
//       action: existingItem.rows.length > 0 ? "updated" : "added",
//     };

//     console.log("✅ Cart operation successful:", response.action);
//     res.status(201).json(response);
//   } catch (error) {
//     // ✅ ENHANCED: Better error logging
//     console.error("❌ Error adding to cart:", error.message);
//     console.error("Error details:", {
//       code: error.code,
//       detail: error.detail,
//       constraint: error.constraint,
//     });

//     res.status(500).json({
//       success: false,
//       message: "Server error while adding to cart",
//       error: error.message,
//       // ✅ Don't expose sensitive error details in production
//       ...(process.env.NODE_ENV === "development" && {
//         errorCode: error.code,
//         errorDetail: error.detail,
//       }),
//     });
//   }
// };

// module.exports = addToCart;

const pool = require("../../database/database");

const addToCart = async (req, res) => {
  console.log("=== ADD TO CART ===");
  console.log("Request body:", req.body);

  const {
    user_id,
    userId,
    customer_id,
    customerId,
    menu_item_id,
    menuItemId,
    item_id,
    itemId,
    restaurant_id,
    restaurantId,
    quantity,
    special_instructions,
    specialInstructions,
    notes,
    price,
  } = req.body;

  const actualUserId = user_id || userId || customer_id || customerId || 1;
  const actualMenuItemId = menu_item_id || menuItemId || item_id || itemId;
  const actualRestaurantId = restaurant_id || restaurantId;
  const actualQuantity = quantity || 1;
  const actualNotes = special_instructions || specialInstructions || notes || "";

  console.log("Processed data:", {
    actualUserId,
    actualMenuItemId,
    actualRestaurantId,
    actualQuantity,
    actualNotes,
  });

  try {
    if (!actualUserId || !actualMenuItemId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // FIXED: Use correct column names
    const menuItemQuery = await pool.query("SELECT * FROM menu_items WHERE item_id = $1", [actualMenuItemId]);

    if (menuItemQuery.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const menuItemDetails = menuItemQuery.rows[0];

    // FIXED: Check with correct column names
    const existingItem = await pool.query(`SELECT * FROM cart_items WHERE user_id = $1 AND menu_item_id = $2`, [
      actualUserId,
      actualMenuItemId,
    ]);

    let result;

    if (existingItem.rows.length > 0) {
      // FIXED: Update with correct column names
      const newQuantity = existingItem.rows[0].quantity + parseInt(actualQuantity);

      result = await pool.query(
        `UPDATE cart_items 
         SET quantity = $1, special_instructions = $2, updated_at = CURRENT_TIMESTAMP
         WHERE cart_id = $3 
         RETURNING *`,
        [newQuantity, actualNotes, existingItem.rows[0].cart_id]
      );

      console.log("✅ Updated existing cart item");
    } else {
      // FIXED: Insert with correct column names
      result = await pool.query(
        `INSERT INTO cart_items (user_id, menu_item_id, quantity, special_instructions, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [actualUserId, actualMenuItemId, actualQuantity, actualNotes]
      );

      console.log("✅ Added new item to cart");
    }

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      cartItem: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error adding to cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding to cart",
      error: error.message,
    });
  }
};

module.exports = addToCart;
