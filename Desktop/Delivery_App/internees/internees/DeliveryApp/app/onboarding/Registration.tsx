// now w e want to create a signin screen

//now we want to make a order screen that will be shown after the welcome screen

import { useRouter } from "expo-router";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SigninScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Order Screen</Text> */}

        <Image
          source={require("../../assets/images/signin.jpeg")}
          style={{ width: 205, height: 205, marginBottom: 130 }}
        />
        <Text style={styles.title}>Let's You In</Text>

        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.socialText}>
            <Image source={require("../../assets/images/facebook.jpeg")} style={styles.icon} /> Continue with facebook
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.socialText}>
            <Image source={require("../../assets/images/google.jpeg")} style={styles.icon} /> Continue with google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.socialText}>
            <Image source={require("../../assets/images/apple.jpeg")} style={styles.icon} /> Continue with apple
          </Text>
        </TouchableOpacity>
        <Text style={styles.description}>or</Text>

        {/* <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding/signup")}> */}
        {/* <Text style={styles.buttonText}>Sign in with Phone Number</Text> */}
        {/* </TouchableOpacity> */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign in with Phone Number</Text>
        </TouchableOpacity>

        <View
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20, bottom: 140 }}
        >
          <Text style={{ color: "#6f7170", fontSize: 16 }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/onboarding/signup")}>
            <Text style={{ color: "#37c667", fontWeight: "bold", fontSize: 16 }}>Sign up</Text>
          </TouchableOpacity>
        </View>
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
    bottom: 130,
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
    bottom: 140,
  },
  button: {
    backgroundColor: "#37c667",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    bottom: 140,
    width: 300,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonText2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
  socialText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    backgroundColor: "white",
    bottom: 150,
  },
  socialBtn: {
    backgroundColor: "white",
    padding: 1,
    borderRadius: 10,
    marginTop: 20,
    bottom: -10,
    width: "100%",
    height: 60,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  or: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
});
