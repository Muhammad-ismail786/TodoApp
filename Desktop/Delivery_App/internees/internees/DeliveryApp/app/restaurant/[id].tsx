import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  FlatList,
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
  min_price?: number;
  average_rating?: number;
  image_url?: string;
}

interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const RestaurantDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Safely get the ID
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Params:", params);
    console.log("ID:", id);

    if (id) {
      fetchRestaurantDetails();
    } else {
      setError("No restaurant ID provided");
      setLoading(false);
    }
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      console.log("=== FRONTEND DEBUG ===");
      console.log("Fetching restaurant details for ID:", id);
      console.log("Full URL:", `${IP_ADDRESS}/restaurant-menu/${id}`);

      // ✅ FIXED: Only one response declaration
      const response = await axios.get(`${IP_ADDRESS}/restaurant-menu/${id}`);

      console.log("Response received!");
      console.log("Restaurant:", response.data.restaurant?.name);
      console.log("Menu items count:", response.data.menuItems?.length);

      if (response.data.menuItems?.length > 0) {
        console.log("First menu item:", response.data.menuItems[0].name);
      }

      setRestaurant(response.data.restaurant);
      setMenuItems(response.data.menuItems || []);
      setError(null);
    } catch (error: any) {
      console.error("API failed:", error);
      console.error("Using dummy data for testing");

      // IF API FAILS, USE DUMMY DATA
      const dummyRestaurant: Restaurant = {
        restaurant_id: parseInt(id || "1"),
        name: "McDonald's Downtown",
        address: "123 Main Street",
        phone: "0311-1111111",
        email: "downtown@mcdonalds.com",
        average_rating: 4.5,
        image_url: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&h=300&fit=crop",
      };

      const dummyMenuItems: MenuItem[] = [
        {
          item_id: 1,
          name: "Big Mac",
          description: "Two all-beef patties, special sauce, lettuce, cheese",
          price: 6.99,
          image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        },
        {
          item_id: 2,
          name: "Quarter Pounder",
          description: "Quarter pound beef patty with cheese",
          price: 7.49,
          image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        },
      ];

      setRestaurant(dummyRestaurant);
      setMenuItems(dummyMenuItems);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => router.push(`/menuitem/${item.item_id}`)}>
      <Image source={{ uri: item.image_url }} style={styles.menuImage} />
      <View style={styles.menuInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Restaurant</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.debugText}>ID: {id}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRestaurantDetails}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Restaurant</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Restaurant not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{restaurant.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Restaurant Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: restaurant.image_url || "https://via.placeholder.com/400x250/37c667/ffffff?text=Restaurant",
            }}
            style={styles.restaurantImage}
          />
          <View style={styles.overlay}>
            <View style={styles.ratingDistance}>
              <Text style={styles.distance}>1.2 km</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingStar}>⭐</Text>
                <Text style={styles.rating}>({restaurant.average_rating || 0})</Text>
              </View>
            </View>
            <View style={styles.deliveryContainer}>
              <Text style={styles.deliveryText}>$ Delivery</Text>
              <TouchableOpacity style={styles.heartButton}>
                <Text style={styles.heart}>🤍</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Restaurant Info */}
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
          <Text style={styles.restaurantPhone}>{restaurant.phone}</Text>
          <Text style={styles.deliveryTime}>25-30 min</Text>
          <Text style={styles.freeDelivery}>Free delivery</Text>
        </View>

        {/* For You Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For You</Text>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu ({menuItems.length} items)</Text>

          {/* Debug info */}
          <Text style={styles.debugText}>Debug: Found {menuItems.length} menu items</Text>

          {menuItems.length > 0 ? (
            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              scrollEnabled={false}
              keyExtractor={(item) => item.item_id.toString()}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          ) : (
            <View style={styles.noMenuContainer}>
              <Text style={styles.noMenuText}>No menu items available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginTop: 40,
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: 250,
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  ratingDistance: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  distance: {
    color: "white",
    fontSize: 16,
    marginRight: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    fontSize: 16,
  },
  rating: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  deliveryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryText: {
    color: "#37c667",
    fontSize: 18,
    fontWeight: "bold",
  },
  heartButton: {
    padding: 5,
  },
  heart: {
    fontSize: 24,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  restaurantAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  restaurantPhone: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: 16,
    color: "#37c667",
    fontWeight: "600",
    marginBottom: 4,
  },
  freeDelivery: {
    fontSize: 16,
    color: "#37c667",
    fontWeight: "600",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  debugText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#37c667",
  },
  noMenuContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noMenuText: {
    fontSize: 16,
    color: "#666",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default RestaurantDetails;
