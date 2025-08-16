// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   Alert,
//   FlatList,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import axios from "axios";
// import { IP_ADDRESS } from "@/constants/endpoint";

// // Define TypeScript interface to describe the structure of a restaurant object
// interface Restaurant {
//   restaurant_id: number;
//   name: string;
//   address: string;
//   phone: string;
//   email: string;
//   category_id: number;
//   category_name: string;
//   image_url?: string;
// }

// // Main functional component for displaying restaurants
// const Restaurants = () => {
//   // Get URL parameters passed when navigating to this screen
//   const params = useLocalSearchParams();
//   // Get router instance for navigation functions
//   const router = useRouter();

//   // Safely extract parameters and convert to strings
//   const id = String(params.id || "");
//   const name = String(params.name || "Restaurants");

//   // State hooks for managing component data
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Effect hook runs when component mounts or when 'id' changes
//   useEffect(() => {
//     if (id && id !== "undefined") {
//       fetchRestaurants();
//     } else {
//       setError("Invalid category ID");
//       setLoading(false);
//     }
//   }, [id]);

//   // Async function to fetch restaurants data from the server
//   const fetchRestaurants = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axios.get<Restaurant[]>(`${IP_ADDRESS}/categories/${id}/restaurants`, { timeout: 10000 });

//       if (response.data && Array.isArray(response.data)) {
//         setRestaurants(response.data);
//       } else {
//         setError("Invalid data format received");
//       }
//     } catch (error: any) {
//       if (error.code === "NETWORK_ERROR") {
//         setError("Network error - check your connection");
//       } else if (error.response) {
//         setError(`Server error: ${error.response.status}`);
//       } else if (error.request) {
//         setError("No response from server");
//       } else {
//         setError(error.message || "Unknown error");
//       }
//       setRestaurants([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle when user taps on a restaurant card
//   const handleRestaurantClick = (restaurant: Restaurant) => {
//     Alert.alert(
//       restaurant.name || "Restaurant",
//       `Address: ${restaurant.address || "N/A"}\nPhone: ${restaurant.phone || "N/A"}\nCategory: ${
//         restaurant.category_name || "N/A"
//       }`,
//       [{ text: "OK" }]
//     );
//   };

//   // Function to handle restaurant clicks
//   const handleRestaurantPress = (restaurantId: string) => {
//     console.log("Navigating to restaurant ID:", restaurantId);
//     router.push({
//       pathname: "/restaurant/[id]", // This is the correct path
//       params: { id: restaurantId },
//     });
//   };

//   // Function to render each restaurant item in the list
//   const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
//     <TouchableOpacity
//       onPress={() => {
//         console.log("Restaurant item clicked:", item);
//         console.log("Restaurant ID from item:", item.restaurant_id);
//         handleRestaurantPress(String(item.restaurant_id));
//       }}
//       style={styles.restaurantCard}
//     >
//       <View style={styles.restaurantImageContainer}>
//         <Image
//           source={{
//             uri: item.image_url || "https://via.placeholder.com/400x200/37c667/ffffff?text=Restaurant",
//           }}
//           style={styles.restaurantImage}
//         />
//         <View style={styles.ratingContainer}>
//           <Text style={styles.rating}>4.5</Text>
//           <Text style={styles.ratingStar}>⭐</Text>
//         </View>
//       </View>

//       <View style={styles.restaurantInfo}>
//         <Text style={styles.restaurantName}>{item.name || "Unknown Restaurant"}</Text>
//         <Text style={styles.restaurantCategory}>{item.category_name || "Unknown Category"}</Text>
//         <Text style={styles.restaurantAddress}>{item.address || "Address not available"}</Text>
//         <Text style={styles.restaurantPhone}>{item.phone || "Phone not available"}</Text>
//         <View style={styles.deliveryInfo}>
//           <Text style={styles.deliveryTime}>25-30 min</Text>
//           <Text style={styles.deliveryFee}>Free delivery</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   // Main render function
//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header section */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Text style={styles.backArrow}>←</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{name}</Text>
//         <View style={styles.placeholder} />
//       </View>

//       {/* Main content area */}
//       <View style={styles.content}>
//         {loading ? (
//           <View style={styles.centerContainer}>
//             <ActivityIndicator size="large" color="#37c667" />
//             <Text style={styles.loadingText}>Loading restaurants...</Text>
//           </View>
//         ) : error ? (
//           <View style={styles.centerContainer}>
//             <Text style={styles.errorText}>Error: {error}</Text>
//             <TouchableOpacity style={styles.retryButton} onPress={fetchRestaurants}>
//               <Text style={styles.retryText}>Retry</Text>
//             </TouchableOpacity>
//           </View>
//         ) : restaurants.length > 0 ? (
//           <View style={styles.listContainer}>
//             <Text style={styles.resultsText}>
//               {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} found in {name}
//             </Text>
//             <FlatList
//               data={restaurants}
//               renderItem={renderRestaurantCard}
//               keyExtractor={(item) => String(item.restaurant_id)}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.listContent}
//             />
//           </View>
//         ) : (
//           <View style={styles.centerContainer}>
//             <Text style={styles.noDataText}>No restaurants found for {name}</Text>
//             <TouchableOpacity style={styles.retryButton} onPress={fetchRestaurants}>
//               <Text style={styles.retryText}>Retry</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// // StyleSheet object containing all the styling for the component
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//     marginTop: 40,
//   },
//   backButton: {
//     padding: 8,
//   },
//   backArrow: {
//     fontSize: 24,
//     color: "#333",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   placeholder: {
//     width: 40,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   listContainer: {
//     flex: 1,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   resultsText: {
//     fontSize: 16,
//     color: "#666",
//     marginVertical: 16,
//   },
//   restaurantCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   restaurantImageContainer: {
//     position: "relative",
//   },
//   restaurantImage: {
//     width: "100%",
//     height: 200,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   ratingContainer: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     borderRadius: 20,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   rating: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//     marginRight: 2,
//   },
//   ratingStar: {
//     fontSize: 10,
//   },
//   restaurantInfo: {
//     padding: 16,
//   },
//   restaurantName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 4,
//   },
//   restaurantCategory: {
//     fontSize: 14,
//     color: "#37c667",
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   restaurantAddress: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 4,
//   },
//   restaurantPhone: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 8,
//   },
//   deliveryInfo: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   deliveryTime: {
//     fontSize: 14,
//     color: "#37c667",
//     fontWeight: "600",
//   },
//   deliveryFee: {
//     fontSize: 14,
//     color: "#37c667",
//     fontWeight: "600",
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 100,
//   },
//   loadingText: {
//     marginTop: 10,
//     color: "#666",
//     fontSize: 16,
//   },
//   noDataText: {
//     color: "#666",
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: "#37c667",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   errorText: {
//     color: "#ff4444",
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//   },
// });

// export default Restaurants;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { IP_ADDRESS } from "@/constants/endpoint";

// Updated TypeScript interface with new rating and delivery properties
interface Restaurant {
  restaurant_id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  category_id: number;
  category_name: string;
  image_url?: string;
  average_rating?: number;
  total_ratings?: number;
  min_delivery_time?: number;
  max_delivery_time?: number;
  min_order_amount?: number;
  delivery_fee?: number;
}

// Main functional component for displaying restaurants
const Restaurants = () => {
  // Get URL parameters passed when navigating to this screen
  const params = useLocalSearchParams();
  // Get router instance for navigation functions
  const router = useRouter();

  // Safely extract parameters and convert to strings
  const id = String(params.id || "");
  const name = String(params.name || "Restaurants");

  // State hooks for managing component data
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect hook runs when component mounts or when 'id' changes
  useEffect(() => {
    if (id && id !== "undefined") {
      fetchRestaurants();
    } else {
      setError("Invalid category ID");
      setLoading(false);
    }
  }, [id]);

  // Async function to fetch restaurants data from the server
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Restaurant[]>(`${IP_ADDRESS}/categories/${id}/restaurants`, { timeout: 10000 });

      if (response.data && Array.isArray(response.data)) {
        setRestaurants(response.data);
      } else {
        setError("Invalid data format received");
      }
    } catch (error: any) {
      if (error.code === "NETWORK_ERROR") {
        setError("Network error - check your connection");
      } else if (error.response) {
        setError(`Server error: ${error.response.status}`);
      } else if (error.request) {
        setError("No response from server");
      } else {
        setError(error.message || "Unknown error");
      }
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle when user taps on a restaurant card
  const handleRestaurantClick = (restaurant: Restaurant) => {
    Alert.alert(
      restaurant.name || "Restaurant",
      `Address: ${restaurant.address || "N/A"}\nPhone: ${restaurant.phone || "N/A"}\nCategory: ${
        restaurant.category_name || "N/A"
      }`,
      [{ text: "OK" }]
    );
  };

  // Function to handle restaurant clicks
  const handleRestaurantPress = (restaurantId: string) => {
    console.log("Navigating to restaurant ID:", restaurantId);
    router.push({
      pathname: "/restaurant/[id]",
      params: { id: restaurantId },
    });
  };

  // Updated function to render each restaurant item with new features
  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      onPress={() => {
        console.log("Restaurant item clicked:", item);
        console.log("Restaurant ID from item:", item.restaurant_id);
        handleRestaurantPress(String(item.restaurant_id));
      }}
      style={styles.restaurantCard}
    >
      <View style={styles.restaurantImageContainer}>
        <Image
          source={{
            uri: item.image_url || "https://via.placeholder.com/400x200/37c667/ffffff?text=Restaurant",
          }}
          style={styles.restaurantImage}
        />
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{item.average_rating ? Number(item.average_rating).toFixed(1) : "0.0"}</Text>
          <Text style={styles.ratingStar}>⭐</Text>
        </View>
      </View>

      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name || "Unknown Restaurant"}</Text>
        <Text style={styles.restaurantCategory}>{item.category_name || "Unknown Category"}</Text>
        <Text style={styles.restaurantAddress}>{item.address || "Address not available"}</Text>

        {/* NEW: Rating Info */}
        <View style={styles.ratingInfo}>
          <Text style={styles.ratingText}>
            ⭐ {item.average_rating ? Number(item.average_rating).toFixed(1) : "0.0"}({item.total_ratings || 0} reviews)
          </Text>
        </View>

        {/* NEW: Minimum Order Amount */}
        {item.min_order_amount && item.min_order_amount > 0 && (
          <Text style={styles.minOrderText}>Min order: ${item.min_order_amount.toFixed(2)}</Text>
        )}

        <View style={styles.deliveryInfo}>
          {/* UPDATED: Real delivery time */}
          <Text style={styles.deliveryTime}>
            {item.min_delivery_time && item.max_delivery_time
              ? `${item.min_delivery_time}-${item.max_delivery_time} min`
              : "25-30 min"}
          </Text>

          {/* UPDATED: Real delivery fee */}
          <Text style={styles.deliveryFee}>
            {item.delivery_fee === 0 ? "Free delivery" : `$${item.delivery_fee?.toFixed(2) || "2.50"} delivery`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Main render function
  return (
    <SafeAreaView style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main content area */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#37c667" />
            <Text style={styles.loadingText}>Loading restaurants...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchRestaurants}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : restaurants.length > 0 ? (
          <View style={styles.listContainer}>
            <Text style={styles.resultsText}>
              {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} found in {name}
            </Text>
            <FlatList
              data={restaurants}
              renderItem={renderRestaurantCard}
              keyExtractor={(item) => String(item.restaurant_id)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.noDataText}>No restaurants found for {name}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchRestaurants}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

// Updated StyleSheet with new styles added
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
    paddingHorizontal: 16,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  resultsText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 16,
  },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImageContainer: {
    position: "relative",
  },
  restaurantImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  ratingContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 2,
  },
  ratingStar: {
    fontSize: 10,
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  restaurantCategory: {
    fontSize: 14,
    color: "#37c667",
    fontWeight: "600",
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  restaurantPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  // NEW STYLES ADDED HERE:
  ratingInfo: {
    marginVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#FFA500",
    fontWeight: "600",
  },
  minOrderText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  // END OF NEW STYLES
  deliveryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryTime: {
    fontSize: 14,
    color: "#37c667",
    fontWeight: "600",
  },
  deliveryFee: {
    fontSize: 14,
    color: "#37c667",
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  noDataText: {
    color: "#666",
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
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Restaurants;
