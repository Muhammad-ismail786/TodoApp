import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AddTaskScreen() {
  const params = useLocalSearchParams();
  const category = params.category ? JSON.parse(params.category as string) : null;

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("");
  const router = useRouter();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSave = () => {
    // Yahan aap API call ya database logic laga sakte hain
    // Example: axios.post(...);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#181818", padding: 24 }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        Add Task {category ? `in ${category.name}` : ""}
      </Text>
      {step === 1 && (
        <>
          <TextInput
            placeholder="Task Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
            style={{
              backgroundColor: "#222",
              color: "#fff",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          />
          <TextInput
            placeholder="Description"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            style={{
              backgroundColor: "#222",
              color: "#fff",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#A259FF",
              borderRadius: 8,
              padding: 14,
              marginTop: 16,
            }}
            onPress={handleNext}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Next</Text>
          </TouchableOpacity>
        </>
      )}
      {step === 2 && (
        <>
          <TextInput
            placeholder="Due Date (YYYY-MM-DD)"
            placeholderTextColor="#888"
            value={date}
            onChangeText={setDate}
            style={{
              backgroundColor: "#222",
              color: "#fff",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#444",
                borderRadius: 8,
                padding: 14,
                marginRight: 8,
                flex: 1,
              }}
              onPress={handleBack}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#A259FF",
                borderRadius: 8,
                padding: 14,
                flex: 1,
              }}
              onPress={handleNext}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {step === 3 && (
        <>
          <TextInput
            placeholder="Priority (1-10)"
            placeholderTextColor="#888"
            value={priority}
            onChangeText={setPriority}
            keyboardType="numeric"
            style={{
              backgroundColor: "#222",
              color: "#fff",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#444",
                borderRadius: 8,
                padding: 14,
                marginRight: 8,
                flex: 1,
              }}
              onPress={handleBack}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#A259FF",
                borderRadius: 8,
                padding: 14,
                flex: 1,
              }}
              onPress={handleSave}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
