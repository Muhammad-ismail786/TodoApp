import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { IP_ADDRESS } from "@/constants/endpoint";

interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  restaurant_id: number;
}

const MenuItemScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItem();
  }, [id]);

  const fetchMenuItem = async () => {
    try {
      setLoading(true);
      console.log("Fetching menu item for ID:", id);

      const response = await axios.get(`${IP_ADDRESS}/api/menu-item/${id}`);
      console.log("Menu item data:", response.data);

      setItem(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      setError("Failed to load menu item");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED FUNCTION - This is the only major change
  const handleAddToBasket = async () => {
    try {
      console.log("=== ADDING TO CART ===");
      console.log("Item:", item?.name);
      console.log("Quantity:", quantity);
      console.log("Price:", item?.price);

      const cartData = {
        restaurant_id: item?.restaurant_id,
        item_id: item?.item_id,
        quantity: quantity,
        price: item?.price,
        notes: "",
      };

      console.log("Sending cart data:", cartData);

      const response = await axios.post(`${IP_ADDRESS}/cart/add`, cartData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Cart response:", response.data);

      if (response.data.success) {
        Alert.alert(
          "Added to Cart! 🛒",
          `${quantity}x ${item?.name}\nTotal: $${((item?.price || 0) * quantity).toFixed(2)}`,
          [
            {
              text: "Continue Shopping",
              style: "cancel",
              onPress: () => router.back(),
            },
            {
              text: "View Cart",
              onPress: () => {
                router.push("/cart/cart");
              },
            },
          ]
        );
      } else {
        throw new Error(response.data.message || "Failed to add to cart");
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      console.error("Error response:", error.response?.data);

      Alert.alert("Error", "Failed to add item to cart. Please try again.", [{ text: "OK" }]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#37c667" />
          <Text style={styles.loadingText}>Loading menu item...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || "Menu item not found"}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMenuItem}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {/* Header with Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image_url || "https://via.placeholder.com/400x300" }} style={styles.image} />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          </View>

          {/* Item Details */}
          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>
              {item.description ||
                "This Vegetable salad is healthy and delicious summer salad made with fresh raw veggies, avocado, nuts, seeds, herbs, and feta in a light dressing."}
            </Text>

            {/* Quantity Selector */}
            <View style={styles.quantitySection}>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={[styles.qtyButton, quantity <= 1 && styles.qtyButtonDisabled]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Text style={[styles.qtyText, quantity <= 1 && styles.qtyTextDisabled]}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(quantity + 1)}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Add to Basket Button Fixed at Bottom */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToBasket}>
            <Text style={styles.addButtonText}>Add to Basket - ${((item.price || 0) * quantity).toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ✅ ALL YOUR EXISTING STYLES REMAIN THE SAME
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  details: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
    lineHeight: 24,
  },
  quantitySection: {
    marginBottom: 30,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButton: {
    backgroundColor: "#37c667",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  qtyButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  qtyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  qtyTextDisabled: {
    color: "#999999",
  },
  quantity: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 30,
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#37c667",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 60,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#37c667",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MenuItemScreen;
