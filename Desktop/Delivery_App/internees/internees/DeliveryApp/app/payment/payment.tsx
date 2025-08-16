import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  balance?: string;
}

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>("googlepay"); // Default to Google Pay

  const paymentMethods: PaymentMethod[] = [
    { id: "wallet", name: "My Wallet", icon: "💳", balance: "$9,379" },
    { id: "paypal", name: "PayPal", icon: "🅿️" },
    { id: "googlepay", name: "Google Pay", icon: "🌐" },
    { id: "applepay", name: "Apple Pay", icon: "🍎" },
    { id: "cash", name: "Cash Money", icon: "💵" },
    { id: "card", name: "•••• •••• •••• 3083", icon: "💳" },
  ];

  // Replace your handleApply function with this:

  // const handleApply = async () => {
  //   try {
  //     const selectedPayment = paymentMethods.find((method) => method.id === selectedMethod);

  //     if (!selectedPayment) {
  //       Alert.alert("Error", "Please select a payment method");
  //       return;
  //     }

  //     // Save payment method to AsyncStorage
  //     await AsyncStorage.setItem(
  //       "selectedPaymentMethod",
  //       JSON.stringify({
  //         id: selectedPayment.id,
  //         name: selectedPayment.name,
  //         icon: selectedPayment.icon,
  //         balance: selectedPayment.balance || "",
  //       })
  //     );

  //     console.log("✅ Payment saved:", selectedPayment.name);

  //     // ✅ FIXED: Navigate to CHECKOUT (not address selection)
  //     router.push("/delivery/checkout");
  //   } catch (error) {
  //     console.error("❌ Error:", error);
  //     Alert.alert("Error", "Failed to save payment method");
  //   }
  // };

  const handleApply = async () => {
    try {
      const selectedPayment = paymentMethods.find((method) => method.id === selectedMethod);

      if (!selectedPayment) {
        Alert.alert("Error", "Please select a payment method");
        return;
      }

      // Save payment method to AsyncStorage
      await AsyncStorage.setItem(
        "selectedPaymentMethod",
        JSON.stringify({
          id: selectedPayment.id,
          name: selectedPayment.name,
          icon: selectedPayment.icon,
          balance: selectedPayment.balance || "",
        })
      );

      console.log("✅ Payment saved:", selectedPayment.name);

      // 🎯 Navigate to Address Selection (not checkout)
      router.push("/delivery/checkout");
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", "Failed to save payment method");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Payment Methods</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Methods List */}
      <ScrollView style={styles.content}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[styles.paymentItem, selectedMethod === method.id && styles.selectedPaymentItem]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.paymentLeft}>
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{method.name}</Text>
                {method.balance && <Text style={styles.paymentBalance}>{method.balance}</Text>}
              </View>
            </View>
            <View style={[styles.radioButton, selectedMethod === method.id && styles.radioButtonSelected]}>
              {selectedMethod === method.id && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Add New Card Button */}
        <TouchableOpacity style={styles.addCardButton}>
          <Text style={styles.addCardText}>+ Add New Card</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>Apply</Text>
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
    paddingTop: 20,
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 1,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPaymentItem: {
    borderColor: "#37c667",
    backgroundColor: "#f0fff4",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
    textAlign: "center",
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
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#37c667",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#37c667",
  },
  addCardButton: {
    backgroundColor: "#e8f5e8",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addCardText: {
    fontSize: 16,
    color: "#37c667",
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  applyButton: {
    backgroundColor: "#37c667",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  applyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
