import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import { IP_ADDRESS } from "../../constants/endpoint";
import TabBar from "./TabBar";

const PRIORITY_COLORS = [
  "#BDBDBD", // low
  "#FFB74D", // medium
  "#A259FF", // high
];

function getPriorityColor(priority: number) {
  if (priority >= 8) return PRIORITY_COLORS[2];
  if (priority >= 5) return PRIORITY_COLORS[1];
  return PRIORITY_COLORS[0];
}

type Task = {
  id?: number;
  title: string;
  description: string;
  date?: string;
  time?: string;
  priority: number;
  completed: boolean;
};

export default function IndexScreen() {
  const [step, setStep] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false); // NEW
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    priority: 1,
  });

  const router = useRouter();

  // Fetch tasks from backend when screen loads or after adding a task
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${IP_ADDRESS}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // const filteredTasks = tasks.filter((t) => t.title?.toLowerCase().includes(search.toLowerCase()));
  const filteredTasks = tasks.filter(
    (t) =>
      (t.title?.toLowerCase().includes(search.trim().toLowerCase()) ||
        t.description?.toLowerCase().includes(search.trim().toLowerCase())) &&
      (t.title?.trim() !== "" || t.description?.trim() !== "")
  );
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSaveTask = async () => {
    try {
      const response = await axios.post(`${IP_ADDRESS}/tasks`, {
        user_id: 1,
        title: newTask.title,
        description: newTask.description,
        date: newTask.date,
        time: newTask.time,
        priority: newTask.priority,
        completed: false,
      });

      if (response.status === 200) {
        setNewTask({ title: "", description: "", date: "", time: "", priority: 1 });
        alert("Task successfully added!");
        setShowAddModal(false); // CLOSE MODAL
        setStep(0);
        fetchTasks();
      } else {
        console.error("Failed to save task:", response);
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // --- MULTI-STEP MODAL ---
  const renderAddTaskModal = () => (
    <View style={[styles.fullScreenModal, { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }]}>
      {step === 1 && (
        <>
          <Text style={styles.modalTitle}>Add Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newTask.title}
            onChangeText={(text) => setNewTask({ ...newTask, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newTask.description}
            onChangeText={(text) => setNewTask({ ...newTask, description: text })}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setShowAddModal(false);
                setStep(0);
              }}
            >
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => setStep(2)}
              disabled={!newTask.title.trim() && !newTask.description.trim()}
            >
              <Text style={styles.saveTxt}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {step === 2 && (
        <>
          <Text style={styles.modalTitle}>Calendar</Text>
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={newTask.date}
            onChangeText={(text) => setNewTask({ ...newTask, date: text })}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setStep(1)}>
              <Text style={styles.cancelTxt}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setStep(3)} disabled={!newTask.date.trim()}>
              <Text style={styles.saveTxt}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {step === 3 && (
        <>
          <Text style={styles.modalTitle}>Time</Text>
          <TextInput
            style={styles.input}
            placeholder="Time (HH:MM)"
            value={newTask.time}
            onChangeText={(text) => setNewTask({ ...newTask, time: text })}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setStep(2)}>
              <Text style={styles.cancelTxt}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setStep(4)} disabled={!newTask.time.trim()}>
              <Text style={styles.saveTxt}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {step === 4 && (
        <>
          <Text style={styles.modalTitle}>Priority (1-10)</Text>
          <TextInput
            style={styles.input}
            placeholder="Priority (1-10)"
            keyboardType="numeric"
            value={String(newTask.priority)}
            onChangeText={(text) => setNewTask({ ...newTask, priority: Number(text) })}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setStep(3)}>
              <Text style={styles.cancelTxt}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveTask}
              disabled={!newTask.priority || isNaN(newTask.priority) || newTask.priority < 1 || newTask.priority > 10}
            >
              <Text style={styles.saveTxt}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  // --- MAIN RETURN ---
  return (
    <View style={styles.container}>
      {/* Show modal if adding a task */}
      {showAddModal && renderAddTaskModal()}

      {/* Top search bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search your tasks..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Index</Text>
        <Image source={require("../../assets/images/jawad.jpeg")} style={styles.profileImage} />
      </View>

      {/* Show tasks only if search is not empty */}
      {search.trim() !== "" ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredTasks}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>
                <View style={styles.taskRow}>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(item.priority) }]}>
                    <Text style={styles.priorityTagTxt}>P{item.priority}</Text>
                  </View>
                  {item.completed && (
                    <View style={styles.completedTag}>
                      <Text style={styles.completedTagTxt}>Done</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.taskDesc}>{item.description}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>No tasks found.</Text>
            }
          />
        </View>
      ) : (
        // Show illustration or prompt when search is empty
        <View style={styles.illustrationContainer}>
          <Image source={require("../../assets/images/index.jpg")} style={styles.illustration} resizeMode="contain" />
          <Text style={styles.prompt}>What do you want to do today?</Text>
          <Text style={styles.subPrompt}>Tap + to add your tasks</Text>
        </View>
      )}

      {/* Add button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          router.push("/Category/CategoryListScreen");
        }}
      >
        <Text style={styles.addBtnTxt}>+</Text>
      </TouchableOpacity>

      {/* Tab Bar */}
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#181818", paddingTop: 16 },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#181818",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    fontSize: 16,
    color: "#222",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  profileImage: { width: 36, height: 36, borderRadius: 18 },
  illustrationContainer: { alignItems: "center", justifyContent: "flex-start", marginTop: 40 },
  illustration: { width: 260, height: 200, marginBottom: 24, alignSelf: "center" },
  prompt: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subPrompt: { color: "#fff", fontSize: 14, textAlign: "center" },
  addBtnRow: { alignItems: "center", justifyContent: "center", marginTop: 16 },
  addBtnCenter: {
    backgroundColor: "#A259FF",
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  addBtnBottom: {
    backgroundColor: "#A259FF",
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    elevation: 4,
  },
  addBtnTxt: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    borderRadius: 24,
    padding: 24,
    margin: 24,
    justifyContent: "center",
    elevation: 8,
  },
  modalTitle: {
    color: "#fff", // white text for visibility
    fontSize: 24, // larger font size for clarity
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F3F3F3",
    color: "#222",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputDark: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  cancelBtn: { marginRight: 12, padding: 10 },
  cancelTxt: { color: "#888", fontWeight: "bold" },
  saveBtn: { backgroundColor: "#A259FF", borderRadius: 8, padding: 10 },
  saveTxt: { color: "#fff", fontWeight: "bold" },
  priorityRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  priorityBtn: {
    backgroundColor: "#F3F3F3",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    alignItems: "center",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    minWidth: 48,
  },
  taskSummary: { color: "#222", fontSize: 16, marginBottom: 16 },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  taskRow: { flexDirection: "row", alignItems: "center" },
  taskTitle: { color: "#222", fontWeight: "bold", fontSize: 16, flex: 1 },
  priorityTag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityTagTxt: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  completedTag: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  completedTagTxt: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  taskDesc: { color: "#666", fontSize: 14, marginTop: 4 },
  addBtn: {
    backgroundColor: "#A259FF",
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 110,
    right: 32,
    elevation: 4,
    left: "40%",
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#181818",
    borderRadius: 24,
    padding: 24,
    margin: 24,
    justifyContent: "center",
    elevation: 8,
  },
});
