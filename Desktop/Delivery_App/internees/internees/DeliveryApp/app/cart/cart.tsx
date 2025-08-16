// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { useRouter } from "expo-router";
// import axios from "axios";
// import { IP_ADDRESS } from "@/constants/endpoint";

// interface CartItem {
//   cart_id: number;
//   item_id: number;
//   item_name: string;
//   description: string;
//   image_url: string;
//   quantity: number;
//   price: number;
//   total_price: number;
//   restaurant_name: string;
//   restaurant_id: number;
// }

// interface CartResponse {
//   success: boolean;
//   cartItems: CartItem[];
//   totalItems: number;
//   totalValue: string;
// }

// export default function CartScreen() {
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [totalValue, setTotalValue] = useState("0.00");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetching cart...");

//       const response = await axios.get<CartResponse>(`${IP_ADDRESS}/api/cart/1`);
//       console.log("Cart response:", response.data);

//       if (response.data.success) {
//         // ✅ ENSURE ALL PRICES ARE NUMBERS
//         const safeCartItems = response.data.cartItems.map((item) => ({
//           ...item,
//           price: Number(item.price) || 0,
//           total_price: Number(item.total_price) || 0,
//         }));

//         setCartItems(safeCartItems);
//         setTotalValue(response.data.totalValue);
//         setError(null);
//       } else {
//         setError("Failed to load cart");
//       }
//     } catch (error: any) {
//       console.error("Error fetching cart:", error);
//       setError("Failed to load cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       Alert.alert("Clear Cart", "Are you sure you want to remove all items?", [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Clear",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const response = await axios.delete(`${IP_ADDRESS}/cart/clear`);
//               if (response.data.success) {
//                 setCartItems([]);
//                 setTotalValue("0.00");
//                 Alert.alert("Success", "Cart cleared successfully");
//               }
//             } catch (error) {
//               console.error("Error clearing cart:", error);
//               Alert.alert("Error", "Failed to clear cart");
//             }
//           },
//         },
//       ]);
//     } catch (error) {
//       console.error("Error in clearCart:", error);
//     }
//   };

//   const renderCartItem = ({ item }: { item: CartItem }) => (
//     <View style={styles.cartItem}>
//       <Image source={{ uri: item.image_url || "https://via.placeholder.com/80x80" }} style={styles.itemImage} />
//       <View style={styles.itemDetails}>
//         <Text style={styles.itemName}>{item.item_name}</Text>
//         <Text style={styles.restaurantName}>{item.restaurant_name}</Text>
//         <Text style={styles.itemDescription} numberOfLines={2}>
//           {item.description}
//         </Text>
//         <View style={styles.priceRow}>
//           <Text style={styles.quantity}>Qty: {item.quantity}</Text>
//           {/* ✅ SAFE PRICE DISPLAY */}
//           <Text style={styles.price}>${(Number(item.total_price) || 0).toFixed(2)}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Text style={styles.backButton}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>Your Cart</Text>
//           <View style={styles.placeholder} />
//         </View>
//         <View style={styles.centered}>
//           <ActivityIndicator size="large" color="#37c667" />
//           <Text style={styles.loadingText}>Loading cart...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Text style={styles.backButton}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>Your Cart</Text>
//           <View style={styles.placeholder} />
//         </View>
//         <View style={styles.centered}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchCart}>
//             <Text style={styles.retryText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Text style={styles.backButton}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>Your Cart</Text>
//         <TouchableOpacity onPress={clearCart}>
//           <Text style={styles.clearButton}>Clear</Text>
//         </TouchableOpacity>
//       </View>

//       {cartItems.length === 0 ? (
//         <View style={styles.centered}>
//           <Text style={styles.emptyText}>Your cart is empty</Text>
//           <TouchableOpacity style={styles.shopButton} onPress={() => router.push("/HomeScreen/explore")}>
//             <Text style={styles.shopButtonText}>Start Shopping</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           <FlatList
//             data={cartItems}
//             renderItem={renderCartItem}
//             keyExtractor={(item) => item.cart_id.toString()}
//             contentContainerStyle={styles.listContainer}
//             showsVerticalScrollIndicator={false}
//           />

//           <View style={styles.footer}>
//             <View style={styles.totalContainer}>
//               <Text style={styles.totalLabel}>Total: </Text>
//               <Text style={styles.totalValue}>${totalValue}</Text>
//             </View>
//             {/* ✅ UPDATED CHECKOUT BUTTON WITH NAVIGATION */}
//             <TouchableOpacity
//               style={styles.checkoutButton}
//               onPress={() => router.push("/payment/payment")} // ✅ Add this navigation
//             >
//               <Text style={styles.checkoutText}>Proceed to Checkout</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     marginTop: 25,
//   },
//   backButton: {
//     fontSize: 16,
//     color: "#37c667",
//     fontWeight: "600",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   clearButton: {
//     fontSize: 16,
//     color: "#ff4444",
//     fontWeight: "600",
//   },
//   placeholder: {
//     width: 50,
//   },
//   listContainer: {
//     padding: 20,
//   },
//   cartItem: {
//     flexDirection: "row",
//     backgroundColor: "#f8f8f8",
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//   },
//   itemImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 15,
//   },
//   itemDetails: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 4,
//   },
//   restaurantName: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 4,
//   },
//   itemDescription: {
//     fontSize: 14,
//     color: "#888",
//     marginBottom: 8,
//   },
//   priceRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   quantity: {
//     fontSize: 14,
//     color: "#666",
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#37c667",
//   },
//   footer: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     backgroundColor: "#fff",
//     marginBottom: 45,
//   },
//   totalContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   totalLabel: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#333",
//   },
//   totalValue: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#37c667",
//   },
//   checkoutButton: {
//     backgroundColor: "#37c667",
//     borderRadius: 12,
//     padding: 16,
//     alignItems: "center",
//   },
//   checkoutText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#666",
//     marginBottom: 20,
//   },
//   shopButton: {
//     backgroundColor: "#37c667",
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   shopButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   loadingText: {
//     marginTop: 10,
//     color: "#666",
//     fontSize: 16,
//   },
//   errorText: {
//     color: "#ff4444",
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
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { IP_ADDRESS } from "@/constants/endpoint";

interface CartItem {
  cart_id: number;
  user_id: number;
  menu_item_id: number;
  quantity: number;
  special_instructions: string;
  created_at: string;
  updated_at: string;
  item_name: string;
  price: string;
  description: string;
  image_url: string;
  restaurant_name: string;
  restaurant_id: number;
  line_total: string;
}

interface CartResponse {
  success: boolean;
  cartItems: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log("🛒 Fetching cart...");

      const response = await axios.get<CartResponse>(`${IP_ADDRESS}/api/cart/1`);
      console.log("📦 Cart response:", response.data);

      if (response.data.success) {
        setCartItems(response.data.cartItems);
        setTotalAmount(response.data.totalAmount);
        setError(null);
        console.log("✅ Cart loaded successfully");
        console.log("💰 Total Amount:", response.data.totalAmount);
      } else {
        setError("Failed to load cart");
      }
    } catch (error: any) {
      console.error("❌ Error fetching cart:", error);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      Alert.alert("Clear Cart", "Are you sure you want to remove all items?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(`${IP_ADDRESS}/cart/clear`);
              if (response.data.success) {
                setCartItems([]);
                setTotalAmount(0);
                Alert.alert("Success", "Cart cleared successfully");
              }
            } catch (error) {
              console.error("Error clearing cart:", error);
              Alert.alert("Error", "Failed to clear cart");
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Error in clearCart:", error);
    }
  };

  const updateQuantity = async (cartId: number, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0
        // const response = await axios.delete(`${IP_ADDRESS}/api/cart/1/clear`);
        // If you have a variable for userId:
        // const response = await axios.delete(`${IP_ADDRESS}/api/cart/${userId}/clear`);
        // const response = await axios.delete(`${IP_ADDRESS}/api/cart/1/clear`);
        const response = await axios.delete(`${IP_ADDRESS}/cart/clear`);
      } else {
        // Update quantity
        await axios.put(`${IP_ADDRESS}/api/cart/update`, {
          userId: 1,
          itemId: cartId,
          quantity: newQuantity,
        });
      }
      // Refresh cart after update
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update item");
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image_url || "https://via.placeholder.com/80x80" }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        <Text style={styles.restaurantName}>{item.restaurant_name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Price per item */}
        <Text style={styles.unitPrice}>${parseFloat(item.price || "0").toFixed(2)} each</Text>

        {/* Special instructions */}
        {item.special_instructions && <Text style={styles.specialInstructions}>Note: {item.special_instructions}</Text>}

        <View style={styles.priceRow}>
          <View style={styles.quantityControls}>
            {/* <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.cart_id, item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>Qty: {item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.cart_id, item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity> */}
          </View>

          {/* Line total */}
          <Text style={styles.lineTotal}>${parseFloat(item.line_total || "0").toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your Cart</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#37c667" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your Cart</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCart}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => router.push("/HomeScreen/explore")}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.cart_id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            {/* Cart Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items):</Text>
                <Text style={styles.summaryAmount}>${totalAmount.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee:</Text>
                <Text style={styles.summaryAmount}>$2.50</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax:</Text>
                <Text style={styles.summaryAmount}>${(totalAmount * 0.08).toFixed(2)}</Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${(totalAmount + 2.5 + totalAmount * 0.08).toFixed(2)}</Text>
              </View>
            </View>
            {/* /payment/payment")}> */}
            <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push("/delivery/checkout")}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 25,
  },
  backButton: {
    fontSize: 16,
    color: "#37c667",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "600",
  },
  placeholder: {
    width: 50,
  },
  listContainer: {
    padding: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
  },
  unitPrice: {
    fontSize: 14,
    color: "#37c667",
    fontWeight: "600",
    marginBottom: 4,
  },
  specialInstructions: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#37c667",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 8,
  },
  lineTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#37c667",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    marginBottom: 45,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryAmount: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#37c667",
  },
  checkoutButton: {
    backgroundColor: "#37c667",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  checkoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: "#37c667",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
