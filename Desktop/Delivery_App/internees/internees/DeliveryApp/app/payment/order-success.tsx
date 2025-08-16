import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function OrderSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.message}>
          Your delicious food is being prepared and will be delivered in 25-30 minutes.
        </Text>

        <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/HomeScreen/explore")}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  homeButton: {
    backgroundColor: "#37c667",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
