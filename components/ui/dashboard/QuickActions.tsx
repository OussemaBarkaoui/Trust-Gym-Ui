import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { createShadow } from "@/utils/platformStyles";

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, { backgroundColor: action.color }]}
            onPress={action.onPress}
          >
            <Ionicons name={action.icon} size={24} color={Colors.white} />
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...createShadow(Colors.black, { width: 0, height: 2 }, 0.1, 4, 3),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  actionsContainer: {
    paddingRight: 20,
  },
  actionCard: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    ...createShadow(Colors.black, { width: 0, height: 1 }, 0.2, 2, 2),
  },
  actionTitle: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
});
