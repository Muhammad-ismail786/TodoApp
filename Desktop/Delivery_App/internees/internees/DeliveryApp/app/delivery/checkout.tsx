import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types
interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  balance?: string;
  method_type?: string;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [orderTotal] = useState(25.99);
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem("selectedDeliveryAddress");
      if (savedAddress) {
        setSelectedAddress(JSON.parse(savedAddress));
      }
      const savedPayment = await AsyncStorage.getItem("selectedPaymentMethod");
      if (savedPayment) {
        setSelectedPayment(JSON.parse(savedPayment));
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  const handleChangeAddress = () => {
    router.push({ pathname: "/address/select" });
  };

  const handleChangePayment = () => {
    router.push("/payment/payment");
  };

  // ✅ SUPER SIMPLE: Just navigate directly to delivery screen
  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      Alert.alert("Error", "Please select both address and payment method");
      return;
    }

    setLoading(true);
    setIsProcessingPayment(true);

    try {
      console.log("🚀 Processing order (simulation)...");

      // Show processing for 2 seconds for better UX
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear stored data
      await AsyncStorage.removeItem("selectedDeliveryAddress");
      await AsyncStorage.removeItem("selectedPaymentMethod");

      setIsProcessingPayment(false);
      setLoading(false);

      // ✅ DIRECT NAVIGATION: Go straight to delivery screen
      console.log("🚚 Navigating to delivery screen...");
      // router.push("/address/select");
      router.push("/HomeScreen/Home1");
    } catch (error) {
      setIsProcessingPayment(false);
      setLoading(false);
      console.error("❌ Navigation error:", error);
    }
  };

  const subtotal = 23.49;
  const deliveryFee = 2.5;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Checkout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={handleChangeAddress}>
              <Text style={styles.changeButton}>Change</Text>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            <View style={styles.selectedItem}>
              <Text style={styles.addressIcon}>📍</Text>
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
                <Text style={styles.addressText}>{selectedAddress.address}</Text>
                <Text style={styles.addressCity}>{selectedAddress.city}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.selectButton} onPress={handleChangeAddress}>
              <Text style={styles.selectButtonText}>Select Delivery Address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={handleChangePayment}>
              <Text style={styles.changeButton}>Change</Text>
            </TouchableOpacity>
          </View>

          {selectedPayment ? (
            <View style={styles.selectedItem}>
              <Text style={styles.paymentIcon}>{selectedPayment.icon}</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{selectedPayment.name}</Text>
                {selectedPayment.balance && <Text style={styles.paymentBalance}>{selectedPayment.balance}</Text>}
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.selectButton} onPress={handleChangePayment}>
              <Text style={styles.selectButtonText}>Select Payment Method</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${orderTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Estimated Delivery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimated Delivery</Text>
          <Text style={styles.deliveryTime}>25-30 minutes</Text>
        </View>
      </ScrollView>

      {/* Processing Payment Overlay */}
      {isProcessingPayment && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContent}>
            <ActivityIndicator size="large" color="#37c667" />
            <Text style={styles.processingTitle}>Processing Order</Text>
            <Text style={styles.processingText}>Preparing your delivery...</Text>
            <Text style={styles.processingSubtext}>Redirecting to delivery tracking...</Text>
          </View>
        </View>
      )}

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, (!selectedAddress || !selectedPayment || loading) && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={!selectedAddress || !selectedPayment || loading}
        >
          <Text style={styles.placeOrderText}>
            {loading ? "Processing..." : `Place Order - $${orderTotal.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  changeButton: {
    fontSize: 16,
    color: "#37c667",
    fontWeight: "500",
  },
  selectButton: {
    borderWidth: 2,
    borderColor: "#37c667",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#37c667",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  addressCity: {
    fontSize: 13,
    color: "#888",
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  paymentBalance: {
    fontSize: 14,
    color: "#37c667",
    fontWeight: "600",
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#37c667",
  },
  deliveryTime: {
    fontSize: 16,
    color: "#37c667",
    fontWeight: "500",
  },
  footer: {
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  placeOrderButton: {
    backgroundColor: "#37c667",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  placeOrderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  processingContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  processingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  processingSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
