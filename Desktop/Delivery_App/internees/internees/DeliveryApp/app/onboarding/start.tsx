// we want to create a start screen for the onboarding process
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
export default function StartScreen() {
  const router = useRouter();
  const styles = StyleSheet.create({
    button: {
      backgroundColor: "#19C37D",
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      marginTop: 600,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
  return (
    <View style={{ bottom: 0, flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          padding: 15,
          margin: 200,
          width: "100%",
          position: "absolute",
          bottom: 0,
          marginBottom: 450,
          marginTop: 150,
          marginLeft: 125,
          marginRight: 125,

          alignItems: "center",
          justifyContent: "center",

          left: 0,
          right: 150,
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        Foodu!
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding/welcome")}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <Icon
        name="truck-fast"
        size={300}
        color="green"
        style={{
          padding: 15,
          margin: 200,
          width: "100%",
          position: "absolute",
          bottom: 7,
          marginBottom: 445,
          marginTop: 150,
          marginLeft: 35,
          marginRight: 120,

          alignItems: "center",
          justifyContent: "center",

          left: 0,
          right: 155,
          fontSize: 50,
          fontWeight: "bold",
        }}
      />
    </View>
  );
}
