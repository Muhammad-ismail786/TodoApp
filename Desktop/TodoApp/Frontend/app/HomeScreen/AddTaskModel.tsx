import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { IP_ADDRESS } from "@/constants/endpoint";

type AddTaskModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AddTaskModal({ visible, onClose }: AddTaskModalProps) {
  const [taskname, setTaskname] = useState("");
  const [reviews, setReviews] = useState("");
  const [priority, setPriority] = useState("");
  const [user_id, setUserId] = useState(""); // You should set this from your user context/session

  const handleSave = async () => {
    try {
      await axios.post(`${IP_ADDRESS}/tasks/add`, {
        user_id, // must be a valid user id (11, 13, 14, 15)
        taskname, // must not be empty
        priority: Number(priority), // must be integer 1-10
        reviews,
      });
      onClose();
      setTaskname("");
      setReviews("");
      setPriority("");
    } catch (error) {
      console.log("Error saving task:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={taskname}
            onChangeText={setTaskname}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={reviews}
            onChangeText={setReviews}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Priority (1-10)"
            value={priority}
            onChangeText={setPriority}
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
          {/* You can set user_id from context or props */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveTxt}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#232323",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 320,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#181818",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  cancelBtn: {
    marginRight: 12,
    padding: 10,
  },
  cancelTxt: {
    color: "#aaa",
    fontWeight: "bold",
  },
  saveBtn: {
    backgroundColor: "#A259FF",
    borderRadius: 8,
    padding: 10,
  },
  saveTxt: {
    color: "#fff",
    fontWeight: "bold",
  },
});
