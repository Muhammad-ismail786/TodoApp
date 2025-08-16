// import React, { useState } from "react";
// import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native";
// // Import your date/time picker and priority selector components here

// export default function HomeScreen() {
//   const [tasks, setTasks] = useState([
//     // Example tasks
//     { id: 1, title: "Do math homework", description: "Chapter 2", priority: 7, date: "2025-08-12", time: "08:00" },
//     // ...other tasks
//   ]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     priority: 1,
//     date: "",
//     time: "",
//   });

//   const openModal = () => setModalVisible(true);
//   const closeModal = () => setModalVisible(false);

//   const handleSaveTask = () => {
//     setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
//     setNewTask({ title: "", description: "", priority: 1, date: "", time: "" });
//     closeModal();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Index Screen ( Home )</Text>
//       <FlatList
//         data={tasks}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.taskCard}>
//             <Text style={styles.taskTitle}>{item.title}</Text>
//             <Text style={styles.taskDesc}>{item.description}</Text>
//             <Text style={styles.taskMeta}>
//               Priority: {item.priority} | {item.date} {item.time}
//             </Text>
//           </View>
//         )}
//       />
//       <TouchableOpacity style={styles.addBtn} onPress={openModal}>
//         <Text style={styles.addBtnTxt}>+</Text>
//       </TouchableOpacity>

//       {/* Add Task Modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.overlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Add Task</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Task Title"
//               value={newTask.title}
//               onChangeText={(text) => setNewTask({ ...newTask, title: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Description"
//               value={newTask.description}
//               onChangeText={(text) => setNewTask({ ...newTask, description: text })}
//             />
//             {/* Date/Time Picker and Priority Selector can go here */}
//             <TextInput
//               style={styles.input}
//               placeholder="Date (YYYY-MM-DD)"
//               value={newTask.date}
//               onChangeText={(text) => setNewTask({ ...newTask, date: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Time (HH:MM)"
//               value={newTask.time}
//               onChangeText={(text) => setNewTask({ ...newTask, time: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Priority (1-10)"
//               value={String(newTask.priority)}
//               onChangeText={(text) => setNewTask({ ...newTask, priority: Number(text) })}
//               keyboardType="numeric"
//             />
//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
//                 <Text style={styles.cancelTxt}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTask}>
//                 <Text style={styles.saveTxt}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#222", padding: 16 },
//   header: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 12, alignSelf: "center" },
//   taskCard: { backgroundColor: "#333", borderRadius: 10, padding: 12, marginBottom: 10 },
//   taskTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   taskDesc: { color: "#ccc", fontSize: 14 },
//   taskMeta: { color: "#aaa", fontSize: 12, marginTop: 4 },
//   addBtn: {
//     position: "absolute",
//     right: 24,
//     bottom: 24,
//     backgroundColor: "#A259FF",
//     borderRadius: 32,
//     width: 56,
//     height: 56,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   addBtnTxt: { color: "#fff", fontSize: 32, fontWeight: "bold" },
//   overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end", alignItems: "center" },
//   modalContainer: {
//     width: "100%",
//     backgroundColor: "#232323",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 24,
//     minHeight: 320,
//   },
//   modalTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 16 },
//   input: {
//     backgroundColor: "#181818",
//     color: "#fff",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#333",
//   },
//   buttonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
//   cancelBtn: { marginRight: 12, padding: 10 },
//   cancelTxt: { color: "#aaa", fontWeight: "bold" },
//   saveBtn: { backgroundColor: "#A259FF", borderRadius: 8, padding: 10 },
//   saveTxt: { color: "#fff", fontWeight: "bold" },
// });
