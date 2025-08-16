import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
};

function TabIcon({ name, label, active }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Ionicons name={name} size={24} color={active ? "#A259FF" : "#fff"} />
      <Text style={[styles.tabLabel, active && { color: "#A259FF" }]}>{label}</Text>
    </View>
  );
}

export default function TabBar() {
  return (
    <View style={styles.tabs}>
      <TabIcon name="home" label="Index" active />
      <TabIcon name="calendar" label="Calendar" />
      <TabIcon name="bulb" label="Focus" />
      <TabIcon name="person" label="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    position: "absolute",
    bottom: 40, // moved up from 0 to 40
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#232323",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
  },
});
