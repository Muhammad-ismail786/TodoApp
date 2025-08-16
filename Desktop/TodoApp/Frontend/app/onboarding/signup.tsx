import { IP_ADDRESS } from "@/constants/endpoint";
import axios from "axios";
import { router } from "expo-router";
import React from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const Signup = () => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill all fields");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      console.log("Attempting signup with:", { username, password: "***" });

      const response = await axios.post(`${IP_ADDRESS}/users/signup`, {
        username,
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Signup response:", response.data);
      Alert.alert("Success", "Account created successfully");
      router.push("/onboarding/login");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
          <Text style={{ color: "#fff", fontSize: 24 }}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Register</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          placeholder="Enter your Username"
          placeholderTextColor="#888"
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter your Email"
          placeholderTextColor="#888"
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.registerBtn} onPress={handleSignup}>
          <Text style={styles.registerTxt}>Register</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.socialBtnGoogle}>
          <Text style={styles.socialBtnText}>
            <Text style={styles.googleIcon}>G</Text> Register with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtnApple}>
          <Text style={styles.socialBtnText}>
            <Text style={styles.appleIcon}></Text> Register with Apple
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/onboarding/login")}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 24,
    paddingTop: 32, // reduced from 48 to move content up
    paddingBottom: 32, // add padding to avoid overlap with Android nav bar
  },
  backArrow: {
    position: "absolute",
    top: 24,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 32,
    alignSelf: "flex-start",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
    marginTop: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10, // reduced from 12 for less height
    fontSize: 16,
    marginBottom: 4, // reduced from 8 for less space between inputs
    borderWidth: 1,
    borderColor: "#333",
    color: "#222",
  },
  registerBtn: {
    backgroundColor: "#5C5A9C",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 10,
  },
  registerTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  orText: {
    color: "#888",
    marginHorizontal: 8,
    fontSize: 15,
  },
  socialBtnGoogle: {
    backgroundColor: "#111",
    borderColor: "#5C5A9C",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  socialBtnApple: {
    backgroundColor: "#111",
    borderColor: "#5C5A9C",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  socialBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  googleIcon: {
    color: "#EA4335",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
  appleIcon: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
  footer: {
    marginTop: 18, // reduced from 32 for less space above footer
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // removed position: "absolute" so it stays in flow
  },
  footerPrompt: {
    color: "#aaa",
    fontSize: 14,
  },
  footerLink: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 2,
    textDecorationLine: "underline",
  },
});
