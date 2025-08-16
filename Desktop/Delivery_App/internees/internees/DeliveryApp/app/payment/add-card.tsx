// app/payment/add-card.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function AddCardScreen() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const handleAddCard = () => {
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Here you would typically save the card to your backend
    Alert.alert("Card Added Successfully!", "Your payment method has been added.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Add New Card</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Add Payment Method</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Holder Name</Text>
            <TextInput style={styles.input} placeholder="John Doe" value={cardHolder} onChangeText={setCardHolder} />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={setExpiryDate}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>
      </View>

      {/* Add Card Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
          <Text style={styles.addButtonText}>Add Card</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  form: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  footer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  addButton: {
    backgroundColor: "#37c667",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
