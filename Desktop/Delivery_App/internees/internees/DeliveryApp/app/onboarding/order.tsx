//now we want to make a order screen that will be shown after the welcome screen

import { useRouter } from "expo-router";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OrderScreen() {
  const router = useRouter();
  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     justifyContent: "center",
  //     alignItems: "center",
  //   },
  //   title: {
  //     fontSize: 40,
  //     fontWeight: "bold",
  //     color: "#69c23b",
  //     marginBottom: 20,
  //     bottom: 5,

  //   },
  // });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Order Screen</Text> */}

        <Image
          source={require("../../assets/images/order.jpg")}
          style={{ width: 300, height: 500, marginBottom: 130 }}
        />
        <Text style={styles.title}>Order For Food</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim sequi nostrum dolores similique.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding/payment")}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        {/* <Text style={{ fontSize: 20, fontWeight: "bold", color: "green" }}>🍳 🌭 🍟 🥤</Text> */}
        {/* <Text>Order Screen</Text> */}
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
    bottom: 180,
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
    bottom: 180,
  },
  button: {
    backgroundColor: "#37c667",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    bottom: 100,
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
