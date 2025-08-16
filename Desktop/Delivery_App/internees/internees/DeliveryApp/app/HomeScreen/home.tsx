// Import React library for creating components
import React from "react";
// Import the bottom tab navigator from React Navigation for creating tab-based navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Import Image component from React Native for displaying icons
import { Image } from "react-native";

// Import all the screen components that will be displayed in each tab
import Home1 from "./Home1"; // Home screen component
import Orders from "./orders"; // Orders screen component
import Message from "./message"; // Messages screen component
import E_Wallet from "./E_Wallet"; // E-Wallet screen component
import Profile from "./Profile"; // Profile screen component

// Create a bottom tab navigator instance
const Tab = createBottomTabNavigator();

// Main Home component that sets up the bottom tab navigation
const Home = () => {
  return (
    // Tab Navigator container with custom configuration
    <Tab.Navigator
      // screenOptions is a function that returns configuration for each tab screen
      screenOptions={({ route }) => ({
        // Hide the header for all tab screens
        headerShown: false,

        // Custom function to render tab bar icons
        tabBarIcon: ({ focused }) => {
          // Variable to store the icon source path
          let iconSource;

          // Switch statement to assign different icons based on the route name
          if (route.name === "Home1") {
            // Home tab icon
            iconSource = require("../../assets/images/home.png");
          } else if (route.name === "Orders") {
            // Orders tab icon
            iconSource = require("../../assets/images/orders.png");
          } else if (route.name === "Message") {
            // Messages tab icon
            iconSource = require("../../assets/images/message.png");
          } else if (route.name === "E_Wallet") {
            // Wallet tab icon
            iconSource = require("../../assets/images/wallet.png");
          } else if (route.name === "Profile") {
            // Profile tab icon
            iconSource = require("../../assets/images/profile.png");
          }

          // Return the Image component with the selected icon
          return (
            <Image
              source={iconSource} // The icon image source
              style={{
                width: 24, // Icon width in pixels
                height: 24, // Icon height in pixels
                // Change icon color based on whether tab is active/focused
                // Green (#37c667) when focused, gray (#999) when not focused
                tintColor: focused ? "#37c667" : "#999",
              }}
            />
          );
        },

        // Color for active tab labels (green theme color)
        tabBarActiveTintColor: "#37c667",
        // Color for inactive tab labels (gray)
        tabBarInactiveTintColor: "#999",
      })}
    >
      {/* Home tab screen */}
      <Tab.Screen
        name="Home1" // Internal route name
        component={Home1} // Component to render for this tab
        options={{
          tabBarLabel: "Home", // Display label in tab bar (different from route name)
        }}
      />

      {/* Orders tab screen */}
      <Tab.Screen
        name="Orders" // Route name and tab label will be "Orders"
        component={Orders} // Orders component to render
      />

      {/* Messages tab screen */}
      <Tab.Screen
        name="Message" // Route name and tab label will be "Message"
        component={Message} // Message component to render
      />

      {/* E-Wallet tab screen */}
      <Tab.Screen
        name="E_Wallet" // Internal route name
        component={E_Wallet} // E_Wallet component to render
        options={{
          tabBarLabel: "Wallet", // Display label in tab bar (cleaner than "E_Wallet")
        }}
      />

      {/* Profile tab screen */}
      <Tab.Screen
        name="Profile" // Route name and tab label will be "Profile"
        component={Profile} // Profile component to render
      />
    </Tab.Navigator>
  );
};

// Export the Home component as default so it can be imported in other files
export default Home;
