import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../constants/Colors";

interface SubscriptionCardProps {
  planName: string;
  status: "active" | "expired" | "expiring";
  expiryDate: string;
  daysRemaining: number;
  onRenew: () => void;
  onUpgrade: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  planName,
  status,
  expiryDate,
  daysRemaining,
  onRenew,
  onUpgrade,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return Colors.success;
      case "expiring":
        return Colors.warning;
      case "expired":
        return Colors.error;
      default:
        return Colors.textSubtle;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Active";
      case "expiring":
        return "Expiring Soon";
      case "expired":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "active":
        return "checkmark-circle";
      case "expiring":
        return "warning";
      case "expired":
        return "close-circle";
      default:
        return "information-circle";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{planName}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <Ionicons name={getStatusIcon()} size={12} color="#fff" />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
        <Ionicons name="fitness" size={24} color={Colors.text} />
      </View>

      <View style={styles.expiryInfo}>
        <Text style={styles.expiryLabel}>Expires on</Text>
        <Text style={styles.expiryDate}>{expiryDate}</Text>
        <Text style={[styles.daysRemaining, { color: getStatusColor() }]}>
          {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.renewButton} onPress={onRenew}>
          <Text style={styles.renewButtonText}>Renew Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
          <Text style={styles.upgradeButtonText}>Upgrade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  expiryInfo: {
    marginBottom: 20,
  },
  expiryLabel: {
    fontSize: 14,
    color: Colors.textSubtle,
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  daysRemaining: {
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  renewButton: {
    flex: 1,
    backgroundColor: Colors.info,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  renewButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  upgradeButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.info,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
