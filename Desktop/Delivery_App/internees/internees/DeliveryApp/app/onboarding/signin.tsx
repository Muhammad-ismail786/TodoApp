import { IP_ADDRESS } from "@/constants/endpoint";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("ismail@gmail.com");
  const [password, setPassword] = useState("Khan");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      console.log("Attempting login with:", { email, password: "***" });
      console.log("API URL:", `${IP_ADDRESS}/users/login`);

      const response = await axios.post(`${IP_ADDRESS}/users/login`, {
        email: email.trim().toLowerCase(),
        password: password,
      });

      console.log("Login response:", response.data);
      Alert.alert("Success", "Logged in successfully");
      // Change this line - use the correct path for your tab navigator
      router.replace("/HomeScreen/home"); // Changed from "/HomeScreen/home" to "/HomeScreen"
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error status:", error.response?.status);
        console.error("Axios error data:", error.response?.data);
        const errorMessage = error.response?.data?.message || "Login failed";
        Alert.alert("Error", errorMessage);
      } else if (error instanceof Error) {
        console.error("General error:", error.message);
        Alert.alert("Error", error.message);
      } else {
        console.error("Unexpected error:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top Image Section */}
        <View style={styles.topImageContainer}>
          <Image source={require("../../assets/images/signup.jpg")} style={styles.topImage} resizeMode="cover" />
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome back</Text>

          <TextInput
            style={styles.input}
            value={email}
            placeholder="Email"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Password"
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topImageContainer: {
    height: screenHeight * 0.4,
    width: "100%",
  },
  topImage: {
    width: "100%",
    height: "100%",
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: "#000",
  },
  button: {
    backgroundColor: "#37c667",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
