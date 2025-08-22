import { Colors } from "@/constants/Colors";
import { MemberSubscription } from "@/entities/MemberSubscription";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SubscriptionInfoProps {
  subscription?: MemberSubscription;
  loading: boolean;
  error?: string | null;
  onRefresh?: () => void;
  getDaysRemaining: (subscription: MemberSubscription) => number;
  getSubscriptionStatus: (subscription: MemberSubscription) => string;
}

export const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({
  subscription,
  loading,
  error,
  onRefresh,
  getDaysRemaining,
  getSubscriptionStatus,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: string | number) => {
    return `$${typeof amount === "string" ? parseFloat(amount) : amount}`;
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="fitness" size={24} color={Colors.primary} />
            <Text style={styles.title}>Current Subscription</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading subscription...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="fitness" size={24} color={Colors.primary} />
            <Text style={styles.title}>Current Subscription</Text>
          </View>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
              <Ionicons name="refresh" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (!subscription) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="fitness" size={24} color={Colors.primary} />
            <Text style={styles.title}>Current Subscription</Text>
          </View>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
              <Ionicons name="refresh" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="card-outline" size={48} color={Colors.textSubtle} />
          <Text style={styles.emptyTitle}>No Active Subscription</Text>
          <Text style={styles.emptyText}>
            You don't have any active subscriptions at the moment.
          </Text>
        </View>
      </View>
    );
  }

  const status = getSubscriptionStatus(subscription);
  const daysRemaining = getDaysRemaining(subscription);
  const statusColor = getStatusColor(status);
  const statusIcon = getStatusIcon(status);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="fitness" size={24} color={Colors.primary} />
          <Text style={styles.title}>Current Subscription</Text>
        </View>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.subscriptionCard}>
        {/* Subscription Plan */}
        <View style={styles.planHeader}>
          <Text style={styles.planName}>
            {subscription.gymSubscription.name}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "20" },
            ]}
          >
            <Ionicons name={statusIcon} size={16} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Subscription Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>
              {formatDate(subscription.startDate)} -{" "}
              {formatDate(subscription.endDate)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Days Remaining</Text>
            <Text
              style={[
                styles.detailValue,
                { color: status === "expired" ? Colors.error : Colors.success },
              ]}
            >
              {status === "expired" ? "Expired" : `${daysRemaining} days`}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValue}>
              {formatAmount(subscription.subscriptionAmount)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Paid Amount</Text>
            <Text style={styles.detailValue}>
              {formatAmount(subscription.paidAmount)}
            </Text>
          </View>

          {subscription.remainingAmount > 0 && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Remaining</Text>
              <Text style={[styles.detailValue, { color: Colors.warning }]}>
                {formatAmount(subscription.remainingAmount)}
              </Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{subscription.gym.location}</Text>
          </View>
        </View>

        {/* Payment Status */}
        {subscription.payments && subscription.payments.length > 0 && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>Payment Status</Text>
            {subscription.payments.map((payment) => (
              <View key={payment.id} style={styles.paymentItem}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentAmount}>
                    {formatAmount(payment.amount)}
                  </Text>
                  <Text style={styles.paymentType}>
                    {payment.typeOfPayment}
                  </Text>
                </View>
                <View
                  style={[
                    styles.paymentStatus,
                    {
                      backgroundColor: payment.isPaid
                        ? Colors.success + "20"
                        : Colors.warning + "20",
                    },
                  ]}
                >
                  <Ionicons
                    name={payment.isPaid ? "checkmark-circle" : "time"}
                    size={16}
                    color={payment.isPaid ? Colors.success : Colors.warning}
                  />
                  <Text
                    style={[
                      styles.paymentStatusText,
                      {
                        color: payment.isPaid ? Colors.success : Colors.warning,
                      },
                    ]}
                  >
                    {payment.isPaid ? "Paid" : "Pending"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSubtle,
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.error,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSubtle,
    textAlign: "center",
  },
  subscriptionCard: {
    padding: 20,
    paddingTop: 0,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    textTransform: "capitalize",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  detailsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSubtle,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  paymentSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  paymentType: {
    fontSize: 12,
    color: Colors.textSubtle,
    textTransform: "capitalize",
  },
  paymentStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
});
