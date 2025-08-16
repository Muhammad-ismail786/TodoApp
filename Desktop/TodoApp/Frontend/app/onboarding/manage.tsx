import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <ImageBackground source={require("../../assets/images/image.png")} style={styles.image} resizeMode="contain" />
        <Text style={styles.heading}>Manage Your tasks</Text>
        <Text style={styles.description}>you can easily manage all of your daily tasks in dom me for free</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding/chat")}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#555",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  heading: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 36,
    letterSpacing: 1,
  },
  description: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    marginHorizontal: 16,
  },
  background: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: 360,
    height: 360,
    marginBottom: 12,
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 70,
  },
  button: {
    backgroundColor: "#A999FF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
