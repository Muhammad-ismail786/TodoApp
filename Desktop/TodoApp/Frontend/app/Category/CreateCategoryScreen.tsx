import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "./CategoryContext";
import { useNavigation } from "expo-router";

type Category = {
  name: string;
  icon: string;
  color: string;
};

type CategoriesContextType = {
  addCategory: (category: Category) => void;
  // add other properties if needed
};

const COLORS = ["#D4E157", "#FFD600", "#4CAF50", "#00BCD4", "#2196F3"];

export default function CreateCategoryScreen() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<keyof typeof Ionicons.glyphMap>("add"); // default to a valid icon
  const [color, setColor] = useState(COLORS[0]);
  const { addCategory } = useCategories() as CategoriesContextType;
  const navigation = useNavigation();

  const handleCreate = () => {
    if (!name) {
      alert("Please enter a category name.");
      return;
    }
    addCategory({ name, icon, color });
    navigation.goBack(); // This will now work
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#181818", padding: 24 }}>
      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 24 }}>Create new category</Text>
      <Text style={{ color: "#fff", marginBottom: 8 }}>Category name :</Text>
      <TextInput
        placeholder="Category name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: "#222",
          color: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />
      <Text style={{ color: "#fff", marginBottom: 8 }}>Category icon :</Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#333",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => setIcon("home")} // make sure "home" is a valid Ionicons name
      >
        <Ionicons name={icon} size={24} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 8 }}>{icon ? "Icon selected" : "Choose icon from library"}</Text>
      </TouchableOpacity>
      <Text style={{ color: "#fff", marginBottom: 8 }}>Category color :</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: c,
              marginRight: 12,
              borderWidth: color === c ? 3 : 0,
              borderColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {color === c && <Ionicons name="checkmark" size={20} color="#fff" />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 14,
            borderRadius: 8,
            backgroundColor: "#222",
            flex: 1,
            marginRight: 8,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCreate}
          style={{
            padding: 14,
            borderRadius: 8,
            backgroundColor: "#A259FF",
            flex: 1,
            marginLeft: 8,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Create Category</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
