import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AddButtonProps = {
  onPress: () => void;
};

export default function AddButton({ onPress }: AddButtonProps) {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Ionicons name="add" size={36} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 110, // moved up from default (e.g. 70) to 90
    alignSelf: "center",
    backgroundColor: "#A259FF",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
