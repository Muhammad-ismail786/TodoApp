// // // // app/index.tsx
// // // import { View, Text, StyleSheet } from "react-native";

// // // export default function HomeScreen() {
// // //   return (
// // //     <View style={styles.container}>
// // //       <Text style={styles.text}>🏡 Welcome to the Home Screen</Text>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   text: {
// // //     fontSize: 22,
// // //     fontWeight: "bold",
// // //   },
// // // });

// // import { useRouter } from "expo-router";
// // import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// // export default function HomeScreen() {
// //   const router = useRouter();

// //   const handleSignIn = () => {
// //     // you can validate email/password here
// //     router.replace("/HomeScreen/index"); // navigates to Tabs layout
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.container}>
// //         <Image
// //           source={require("../../assets/images/background.jpg")}
// //           style={{ width: 205, height: 205, marginBottom: 130 }}
// //         />
// //         <Text style={styles.title}>Let's You In</Text>

// //         <TouchableOpacity style={styles.button} onPress={handleSignIn}>
// //           <Text style={styles.buttonText}>Sign in with Phone Number</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#fff",
// //   },
// //   title: {
// //     fontSize: 40,
// //     fontWeight: "bold",
// //     bottom: 130,
// //     color: "#72f19b",
// //     textAlign: "center",
// //   },
// //   button: {
// //     backgroundColor: "#37c667",
// //     padding: 15,
// //     borderRadius: 10,
// //     marginTop: 20,
// //     bottom: 140,
// //     width: 300,
// //     height: 60,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //   },
// //   buttonText: {
// //     color: "white",
// //     fontWeight: "bold",
// //     fontSize: 18,
// //   },
// // });

// import { useRouter } from "expo-router";
// import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export default function HomeScreen() {
//   const router = useRouter();

//   const handleSignIn = () => {
//     // you can validate email/password here
//     router.replace("/HomeScreen/index"); // navigates to Tabs layout
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.container}>
//         <Image
//           source={require("../../assets/images/background.jpg")}
//           style={{ width: 205, height: 205, marginBottom: 130 }}
//         />
//         <Text style={styles.title}>Let's You In</Text>

//         {/* <TouchableOpacity style={styles.button} onPress={handleSignIn}>
//           <Text style={styles.buttonText}>Sign in with Phone Number</Text>
//         </TouchableOpacity> */}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 40,
//     fontWeight: "bold",
//     bottom: 130,
//     color: "#72f19b",
//     textAlign: "center",
//   },
//   button: {
//     backgroundColor: "#37c667",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     bottom: 140,
//     width: 300,
//     height: 60,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 18,
//   },
// });
