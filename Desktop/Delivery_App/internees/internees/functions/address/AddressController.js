const pool = require("../../database/database");

class AddressController {
  static async getUserAddresses(req, res) {
    const { userId } = req.params;

    try {
      console.log("=== GET USER ADDRESSES ===");
      console.log("User ID:", userId);

      const query = `
        SELECT 
          address_id,
          user_id,
          address_type,
          address_label,
          street_address,
          city,
          state,
          postal_code,
          country,
          is_default,
          is_active,
          created_at
        FROM user_addresses 
        WHERE user_id = $1 AND is_active = true 
        ORDER BY is_default DESC, created_at ASC
      `;

      const result = await pool.query(query, [userId]);
      console.log("Addresses found:", result.rows.length);

      res.json({
        success: true,
        addresses: result.rows,
      });
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch delivery addresses",
        error: error.message,
      });
    }
  }

  static async addAddress(req, res) {
    const { userId, addressType, addressLabel, streetAddress, city, state, postalCode, isDefault } = req.body;

    try {
      console.log("=== ADD NEW ADDRESS ===");
      console.log("Request body:", req.body);

      // If this is being set as default, unset all other defaults for this user
      if (isDefault) {
        await pool.query("UPDATE user_addresses SET is_default = false WHERE user_id = $1", [userId]);
      }

      const insertQuery = `
        INSERT INTO user_addresses (
          user_id, address_type, address_label, street_address, 
          city, state, postal_code, is_default
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;

      const result = await pool.query(insertQuery, [
        userId,
        addressType,
        addressLabel,
        streetAddress,
        city,
        state,
        postalCode,
        isDefault || false,
      ]);

      console.log("Address added successfully:", result.rows[0]);

      res.json({
        success: true,
        message: "Address added successfully",
        address: result.rows[0],
      });
    } catch (error) {
      console.error("Error adding address:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add address",
        error: error.message,
      });
    }
  }

  static async setDefaultAddress(req, res) {
    const { addressId } = req.params;

    try {
      console.log("=== SET DEFAULT ADDRESS ===");
      console.log("Address ID:", addressId);

      // First get the user_id for this address
      const addressResult = await pool.query("SELECT user_id FROM user_addresses WHERE address_id = $1", [addressId]);

      if (addressResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }

      const userId = addressResult.rows[0].user_id;

      // Unset all defaults for this user
      await pool.query("UPDATE user_addresses SET is_default = false WHERE user_id = $1", [userId]);

      // Set this address as default
      const result = await pool.query("UPDATE user_addresses SET is_default = true WHERE address_id = $1 RETURNING *", [
        addressId,
      ]);

      console.log("Default address updated:", result.rows[0]);

      res.json({
        success: true,
        message: "Default address updated successfully",
        address: result.rows[0],
      });
    } catch (error) {
      console.error("Error setting default address:", error);
      res.status(500).json({
        success: false,
        message: "Failed to set default address",
        error: error.message,
      });
    }
  }

  static async updateAddress(req, res) {
    const { addressId } = req.params;
    const { addressType, addressLabel, streetAddress, city, state, postalCode, isDefault } = req.body;

    try {
      console.log("=== UPDATE ADDRESS ===");
      console.log("Address ID:", addressId);
      console.log("Update data:", req.body);

      // If setting as default, unset others first
      if (isDefault) {
        const userResult = await pool.query("SELECT user_id FROM user_addresses WHERE address_id = $1", [addressId]);

        if (userResult.rows.length > 0) {
          await pool.query("UPDATE user_addresses SET is_default = false WHERE user_id = $1", [
            userResult.rows[0].user_id,
          ]);
        }
      }

      const updateQuery = `
        UPDATE user_addresses 
        SET address_type = $1, address_label = $2, street_address = $3,
            city = $4, state = $5, postal_code = $6, is_default = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE address_id = $8
        RETURNING *;
      `;

      const result = await pool.query(updateQuery, [
        addressType,
        addressLabel,
        streetAddress,
        city,
        state,
        postalCode,
        isDefault || false,
        addressId,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }

      res.json({
        success: true,
        message: "Address updated successfully",
        address: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update address",
        error: error.message,
      });
    }
  }

  static async deleteAddress(req, res) {
    const { addressId } = req.params;

    try {
      console.log("=== DELETE ADDRESS ===");
      console.log("Address ID:", addressId);

      // Soft delete by setting is_active to false
      const result = await pool.query("UPDATE user_addresses SET is_active = false WHERE address_id = $1 RETURNING *", [
        addressId,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }

      res.json({
        success: true,
        message: "Address deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete address",
        error: error.message,
      });
    }
  }
}

module.exports = AddressController;
