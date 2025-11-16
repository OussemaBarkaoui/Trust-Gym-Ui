import { Colors } from "@/constants/Colors";
import type { StatusType } from "@/types/common";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusBadgeProps {
  status: StatusType;
  daysRemaining?: number;
}

export const StatusBadge = memo<StatusBadgeProps>(
  ({ status, daysRemaining }) => {
    const getStatusColor = (status: StatusType): string => {
      switch (status) {
        case "active":
          return Colors.success;
        case "expired":
          return Colors.error;
        case "upcoming":
          return Colors.warning;
        default:
          return Colors.textSubtle;
      }
    };

    const getStatusIcon = (status: StatusType): string => {
      switch (status) {
        case "active":
          return "checkmark-circle";
        case "expired":
          return "close-circle";
        case "upcoming":
          return "time";
        default:
          return "information-circle";
      }
    };

    const getStatusText = (status: StatusType): string => {
      switch (status) {
        case "active":
          return daysRemaining !== undefined
            ? `Active (${daysRemaining} days left)`
            : "Active";
        case "expired":
          return "Expired";
        case "upcoming":
          return "Upcoming";
        default:
          return "Unknown";
      }
    };

    const statusColor = getStatusColor(status);
    const statusIcon = getStatusIcon(status);
    const statusText = getStatusText(status);

    return (
      <View style={[styles.container, { backgroundColor: `${statusColor}15` }]}>
        <Ionicons name={statusIcon as any} size={16} color={statusColor} />
        <Text style={[styles.text, { color: statusColor }]}>{statusText}</Text>
      </View>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
});
