//now we want to make a order screen that will be shown after the welcome screen

import { useRouter } from "expo-router";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DeliveryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Order Screen</Text> */}

        <Image
          source={require("../../assets/images/delivery.png")}
          style={{ width: 205, height: 205, marginBottom: 130 }}
        />
        <Text style={styles.title}>Fast Delivery</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim sequi nostrum dolores similique.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding/Registration")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        {/* <Text style={{ fontSize: 20, fontWeight: "bold", color: "green" }}>🍳 🌭 🍟 🥤</Text>
        <Text>Order Screen</Text> */}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    bottom: 20,
    // color: "green",
    marginBottom: 10,
    justifyContent: "flex-end",
    // color: "#37c667",
    color: "#72f19b",

    textAlign: "center",
  },

  description: {
    fontSize: 20,
    fontWeight: "bold",
    // color: "#5f6160",
    color: "#6f7170",
    textAlign: "center",
    bottom: 10,
  },
  button: {
    backgroundColor: "#37c667",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    bottom: -30,
    width: 200,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
