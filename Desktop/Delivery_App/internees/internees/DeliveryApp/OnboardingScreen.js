// YourProjectName/screens/OnboardingScreen.js

import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, StatusBar, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} /> {/* Hides the status bar */}
      {/* Top Illustration Section */}
      <View style={styles.illustrationContainer}>
        <Image
          // IMPORTANT: Adjust this path to where you placed your image!
          source={require("../assets/images/onboarding.jpg")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>
      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Order for Food</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Text>

        {/* Pagination Dots */}
        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Next Button */}
        <Button title="Next" onPress={() => router.push("Next button pressed")}></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    // paddingTop: StatusBar.currentHeight; is removed as StatusBar is hidden
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  illustrationImage: {
    width: width * 0.8,
    height: height * 0.4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  paginationDots: {
    flexDirection: "row",
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#28a745",
  },
  nextButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
