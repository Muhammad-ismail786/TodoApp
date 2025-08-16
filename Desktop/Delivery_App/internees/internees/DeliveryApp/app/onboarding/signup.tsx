import { IP_ADDRESS } from "@/constants/endpoint";
import axios from "axios";
import { router } from "expo-router";
import React from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const Signup = () => {
  const [fullName, setfullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill all fields");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      console.log("Attempting signup with:", { fullName, email, password: "***" });

      const response = await axios.post(`${IP_ADDRESS}/users/signup`, {
        username: fullName,
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Signup response:", response.data);
      Alert.alert("Success", "Account created successfully");
      router.push("/onboarding/signin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        Alert.alert("Error", error.response?.data?.message || "Signup failed");
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
    <View style={styles.container}>
      <Image source={require("../../assets/images/signup.jpg")} />

      <Text style={styles.title}>Create New Account</Text>

      <TextInput style={styles.details} value={fullName} placeholder="Full Name" onChangeText={setfullName} />
      <TextInput
        style={styles.details}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.details}
        value={password}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.details}
        value={confirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.signupbtn} onPress={handleSignup}>
        <Text style={styles.signupTxt}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or continue with</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require("../../assets/images/facebook.jpeg")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require("../../assets/images/google.jpeg")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require("../../assets/images/apple.jpeg")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerPrompt}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/onboarding/signin")}>
          <Text style={styles.footerLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#000",
  },
  details: {
    width: "100%",
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  signupbtn: {
    backgroundColor: "#059031d2",
    width: "100%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  signupTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    marginVertical: 20,
    fontSize: 16,
    color: "#454545d4",
    textAlign: "center",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  socialBtn: {
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    height: 65,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  footerPrompt: {
    fontSize: 16,
    color: "#454545d4",
  },
  footerLink: {
    fontSize: 16,
    color: "#059031d2",
    fontWeight: "bold",
    marginLeft: 5,
  },
});
