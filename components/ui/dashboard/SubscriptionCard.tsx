import { MemberSubscription } from "@/entities/MemberSubscription";
import { createShadow } from "@/utils/platformStyles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../constants/Colors";

const { width } = Dimensions.get("window");

interface SubscriptionCardProps {
  subscription?: MemberSubscription;
  loading?: boolean;
  onPress?: () => void;
  getSubscriptionStatus: (subscription: MemberSubscription) => string;
  getDaysRemaining: (subscription: MemberSubscription) => number;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  loading = false,
  onPress,
  getSubscriptionStatus,
  getDaysRemaining,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [loading, pulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };
  if (loading) {
    return (
      <Animated.View
        style={[styles.container, { transform: [{ scale: pulseAnim }] }]}
      >
        <LinearGradient
          colors={[Colors.gray100, Colors.gray200]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.loadingContainer}>
            <View style={styles.loadingAnimation}>
              <Ionicons name="fitness" size={24} color={Colors.textSubtle} />
            </View>
            <Text style={styles.loadingText}>Loading subscription...</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }

  if (!subscription) {
    return (
      <Animated.View
        style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={["#f8f9fa", "#e9ecef"]}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="card-outline"
                  size={32}
                  color={Colors.textSubtle}
                />
              </View>
              <Text style={styles.emptyTitle}>No Active Subscription</Text>
              <Text style={styles.emptyText}>Tap to explore plans</Text>
              <View style={styles.tapIndicator}>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.primary}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const status = getSubscriptionStatus(subscription);
  const daysRemaining = getDaysRemaining(subscription);

  const getGradientColors = (): [string, string] => {
    switch (status) {
      case "active":
        return ["#4CAF50", "#45a049"];
      case "upcoming":
        return ["#FF9800", "#f57c00"];
      case "expired":
        return ["#f44336", "#d32f2f"];
      default:
        return [Colors.primary, "#E6B800"];
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "active":
        return "checkmark-circle";
      case "upcoming":
        return "time";
      case "expired":
        return "close-circle";
      default:
        return "information-circle";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Active";
      case "upcoming":
        return "Upcoming";
      case "expired":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Background Pattern */}
          <View style={styles.backgroundPattern}>
            <View style={[styles.patternCircle, styles.circle1]} />
            <View style={[styles.patternCircle, styles.circle2]} />
            <View style={[styles.patternCircle, styles.circle3]} />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.planInfo}>
                <View style={styles.planHeader}>
                  <Ionicons
                    name="fitness"
                    size={20}
                    color="rgba(255,255,255,0.9)"
                  />
                  <Text style={styles.planLabel}>Current Plan</Text>
                </View>
                <Text style={styles.planName} numberOfLines={1}>
                  {subscription.gymSubscription.name}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={styles.statusBadge}>
                  <Ionicons name={getStatusIcon()} size={14} color="white" />
                  <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>
              </View>
            </View>

            {/* Main Info */}
            <View style={styles.mainInfo}>
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>
                  {status === "expired" ? "Expired" : "Time Remaining"}
                </Text>
                <Text style={styles.timeValue}>
                  {status === "expired"
                    ? "Plan Expired"
                    : `${daysRemaining} ${
                        daysRemaining === 1 ? "day" : "days"
                      }`}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.locationInfo}>
                <Ionicons
                  name="location"
                  size={14}
                  color="rgba(255,255,255,0.8)"
                />
                <Text style={styles.locationText} numberOfLines={1}>
                  {subscription.gym.location}
                </Text>
              </View>
              <View style={styles.actionIndicator}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="rgba(255,255,255,0.8)"
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    ...createShadow(Colors.black, { width: 0, height: 8 }, 0.15, 16, 8),
  },
  gradientBackground: {
    minHeight: 180,
    position: "relative",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  patternCircle: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 100,
  },
  circle1: {
    width: 80,
    height: 80,
    top: -20,
    right: -20,
  },
  circle2: {
    width: 60,
    height: 60,
    bottom: -10,
    left: -10,
  },
  circle3: {
    width: 40,
    height: 40,
    top: "50%",
    right: "20%",
    opacity: 0.6,
  },
  contentContainer: {
    padding: 24,
    position: "relative",
    zIndex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingAnimation: {
    marginBottom: 12,
    opacity: 0.7,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSubtle,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSubtle,
    textAlign: "center",
    marginBottom: 12,
  },
  tapIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  planInfo: {
    flex: 1,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  planLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  planName: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.white,
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mainInfo: {
    marginBottom: 20,
  },
  timeInfo: {
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    marginLeft: 6,
    textTransform: "capitalize",
  },
  actionIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  viewDetailsText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    marginRight: 4,
  },
});
