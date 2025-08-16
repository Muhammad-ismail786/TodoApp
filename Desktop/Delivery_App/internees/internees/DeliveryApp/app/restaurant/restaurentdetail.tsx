import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { IP_ADDRESS } from "@/constants/endpoint";

interface Restaurant {
  restaurant_id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  image_url: string;
}

// ← PASTE THE UPDATED INTERFACE HERE
interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number; // ← Backend will convert string to number
  image_url: string;
}

const RestaurantScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  // ← REPLACE YOUR fetchData FUNCTION WITH THIS
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching restaurant data for ID:", id);
      console.log("Full URL:", `${IP_ADDRESS}/restaurant-menu/${id}`);

      const response = await axios.get(`${IP_ADDRESS}/restaurant-menu/${id}`);
      console.log("Full response data:", JSON.stringify(response.data, null, 2));

      console.log("Restaurant:", response.data.restaurant?.name);
      console.log("Menu items count:", response.data.menuItems?.length);
      console.log("Menu items:", response.data.menuItems);

      setRestaurant(response.data.restaurant);
      setMenuItems(response.data.menuItems || []);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      console.error("Error response:", error.response?.data);
      setError("Failed to load restaurant data");
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => router.push(`/menuitem/${item.item_id}`)}>
      <Image source={{ uri: item.image_url || "https://via.placeholder.com/100x80" }} style={styles.menuImage} />
      <Text style={styles.menuName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  // ... rest of your component code stays the same
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#37c667" />
          <Text style={styles.loadingText}>Loading restaurant...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{restaurant?.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Image */}
        <Image
          source={{ uri: restaurant?.image_url || "https://via.placeholder.com/400x200" }}
          style={styles.restaurantImage}
        />

        {/* Restaurant Info */}
        <View style={styles.info}>
          <Text style={styles.restaurantName}>{restaurant?.name}</Text>
          <Text style={styles.address}>{restaurant?.address}</Text>
          <View style={styles.deliveryRow}>
            <Text style={styles.deliveryTime}>⏱ 25-30 min</Text>
            <Text style={styles.minOrder}>Min: $12.00</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Menu ({menuItems.length} items)</Text>
          {menuItems.length > 0 ? (
            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item.item_id.toString()}
              columnWrapperStyle={styles.menuRow}
            />
          ) : (
            <Text style={styles.noMenuText}>No menu items available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ... your existing styles stay the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    fontSize: 24,
    color: "#333",
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: { width: 40 },
  restaurantImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  info: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  address: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  deliveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryTime: {
    fontSize: 16,
    color: "#37c667",
    fontWeight: "600",
  },
  minOrder: {
    fontSize: 16,
    color: "#666",
  },
  menuSection: {
    padding: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  menuRow: {
    justifyContent: "space-between",
  },
  menuItem: {
    flex: 1,
    margin: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#333",
    minHeight: 35,
  },
  menuPrice: {
    fontSize: 16,
    color: "#37c667",
    fontWeight: "bold",
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
  noMenuText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    fontStyle: "italic",
    padding: 20,
  },
});

export default RestaurantScreen;
