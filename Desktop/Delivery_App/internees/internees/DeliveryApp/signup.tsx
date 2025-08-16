import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignupScreen() {
  const handleSignup = () => {
    router.replace("/(tabs)/home");
  };
  return (
    <ImageBackground source={require("../assets/images/pizza.jpg")} style={styles.background} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace("/login")}>
          <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
    letterSpacing: 1,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#222",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderColor: "#fff",
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
