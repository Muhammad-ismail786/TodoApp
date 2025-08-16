import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TaskCardProps {
  title: string;
  time: string;
  category?: string;
  priority?: string;
  completed: boolean;
}

export default function TaskCard({ title, time, category, priority, completed }: TaskCardProps) {
  return (
    <View style={[styles.taskCard, completed && styles.completedCard]}>
      <View style={styles.taskRow}>
        <Ionicons name="ellipse-outline" size={22} color="#fff" />
        <Text style={styles.taskTitle}>{title}</Text>
      </View>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTime}>Today At {time}</Text>
        {category && (
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        {priority && (
          <View style={styles.priorityTag}>
            <Ionicons name="flag" size={16} color="#A259FF" />
            <Text style={styles.priorityText}>{priority}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "#232323",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  completedCard: {
    opacity: 0.5,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
  taskDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  taskTime: {
    color: "#aaa",
    fontSize: 14,
    marginRight: 10,
  },
  categoryTag: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  categoryText: {
    color: "#A259FF",
    fontSize: 12,
    fontWeight: "bold",
  },
  priorityTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priorityText: {
    color: "#A259FF",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "bold",
  },
});
