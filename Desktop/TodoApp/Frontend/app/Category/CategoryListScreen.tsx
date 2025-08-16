import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCategories } from "./CategoryContext";

type Category = {
  name: string;
  icon: string;
  color: string;
};

export default function CategoryListScreen() {
  const { categories } = useCategories();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#181818", padding: 24 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 20, marginBottom: 16 }}>Categories:</Text>
        <TouchableOpacity
          onPress={() => router.push("/Category/CreateCategoryScreen")}
          style={{
            backgroundColor: "#A259FF",
            borderRadius: 20,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {categories.length === 0 && <Text style={{ color: "#aaa" }}>No categories yet.</Text>}
        {categories.map((cat: Category, idx: number) => (
          <TouchableOpacity
            key={idx}
            onPress={() =>
              router.push({
                pathname: "/HomeScreen/AddTaskScreen",
                params: { category: JSON.stringify(cat) },
              })
            }
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
          >
            <Ionicons
              name={(cat.icon || "folder") as keyof typeof Ionicons.glyphMap}
              size={24}
              color={cat.color}
              style={{ marginRight: 12 }}
            />
            <Text style={{ color: "#fff", fontSize: 18 }}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
