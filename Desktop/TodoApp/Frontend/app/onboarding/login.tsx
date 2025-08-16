import { IP_ADDRESS } from "@/constants/endpoint";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("Ismail@gmail.com");
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
      router.replace("/HomeScreen/IndexScreen");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818", // black background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#504f51e2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: "#fff",
  },
  button: {
    backgroundColor: "#A259FF",
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
