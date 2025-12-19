import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../constants/Colors";
import { createShadow } from "@/utils/platformStyles";

interface QuickStatsProps {
  checkedInToday: boolean;
  workoutsThisWeek: number;
  lastWorkout: string;
  onCheckIn: () => void;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  checkedInToday,
  workoutsThisWeek,
  lastWorkout,
  onCheckIn,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Stats</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="calendar" size={20} color={Colors.text} />
          </View>
          <Text style={styles.statValue}>{workoutsThisWeek}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="time" size={20} color={Colors.text} />
          </View>
          <Text style={styles.statValue}>{lastWorkout}</Text>
          <Text style={styles.statLabel}>Last Workout</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons
              name={checkedInToday ? "checkmark-circle" : "radio-button-off"}
              size={20}
              color={checkedInToday ? Colors.success : Colors.textSubtle}
            />
          </View>
          <Text style={styles.statValue}>{checkedInToday ? "Yes" : "No"}</Text>
          <Text style={styles.statLabel}>Checked In</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.checkInButton,
          checkedInToday && styles.checkInButtonDisabled,
        ]}
        onPress={onCheckIn}
        disabled={checkedInToday}
      >
        <Ionicons
          name={checkedInToday ? "checkmark-circle" : "location"}
          size={20}
          color={checkedInToday ? Colors.success : Colors.white}
        />
        <Text
          style={[
            styles.checkInButtonText,
            checkedInToday && styles.checkInButtonTextDisabled,
          ]}
        >
          {checkedInToday ? "Already Checked In" : "Check In Now"}
        </Text>
      </TouchableOpacity>
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
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: Colors.gray100,
    borderRadius: 12,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSubtle,
    textAlign: "center",
  },
  checkInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.info,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  checkInButtonDisabled: {
    backgroundColor: Colors.gray100,
  },
  checkInButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  checkInButtonTextDisabled: {
    color: Colors.success,
  },
});
