import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <ImageBackground source={require("../../assets/images/welcome.jpg")} style={styles.background} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.brand}>
          Foodu! <Text style={styles.emoji}>👋</Text>
        </Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente natus fugit harum odit, tempora possimus,
          ipsum consequuntur tenetur quo repellendus quisquam!
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding/order")}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>Next</Text>
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
    backgroundColor: "rgba(0,0,0,0.3)", // optional: thoda dark overlay for better text visibility
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 150,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    // color: "green",
    marginBottom: 4,
    color: "#69c23b",

    textAlign: "center",
  },
  brand: {
    fontSize: 40,
    fontWeight: "bold",
    // color: "green",
    marginBottom: 16,
    textAlign: "center",
    color: "#69c23b",
  },
  emoji: {
    fontSize: 40,
  },
  subtitle: {
    fontSize: 18,
    // color: "#fff",
    textAlign: "center",
    color: "#e6e3e8",
  },
  button: {
    backgroundColor: "#19C37D",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 6,
    bottom: -50,
  },
});
