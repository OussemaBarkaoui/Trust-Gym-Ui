import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  QuickActions,
  QuickStats,
  SubscriptionCard,
} from "../../components/ui";
import { Colors } from "../../constants/Colors";
import { useSession } from "../../contexts/SessionContext";
import { useFadeIn, useSlideIn, useSubscription } from "../../hooks";
import { useLogout } from "../../hooks/useLogout";

const { width } = Dimensions.get("window");

export default function DashBoardScreen() {
  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });
  const headerAnim = useRef(new Animated.Value(-50)).current;

  const { session } = useSession();
  const { confirmLogout } = useLogout();

  const {
    subscription,
    userStats,
    isLoading,
    renewSubscription,
    upgradeSubscription,
    checkIn,
    getQuickActions,
  } = useSubscription();

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRenewSubscription = async () => {
    const result = await renewSubscription();
    Alert.alert(result.success ? "Success" : "Error", result.message, [
      { text: "OK", style: "default" },
    ]);
  };

  const handleUpgradeSubscription = async () => {
    const result = await upgradeSubscription();
    Alert.alert(result.success ? "Success" : "Error", result.message, [
      { text: "OK", style: "default" },
    ]);
  };

  const handleCheckIn = async () => {
    const result = await checkIn();
    Alert.alert(result.success ? "Success" : "Error", result.message, [
      { text: "OK", style: "default" },
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to crush your goals?",
      "Time to get stronger!",
      "Your fitness journey continues",
      "Let's make it happen!",
      "Every workout counts",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header with animation */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerAnim }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.brandContainer}>
              <Text style={styles.headerTitle}>
                <Text style={styles.trustText}>Trust</Text>
                <Text style={styles.gymText}>Gym</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.7}
              onPress={confirmLogout}
            >
              <View style={styles.profileIcon}>
                <Text style={styles.profileText}>👤</Text>
              </View>
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.headerBottom}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>
                {getGreeting()}, {session.user?.firstName || "User"}!
              </Text>
              <Text style={styles.motivationalText}>
                {getMotivationalMessage()}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          {/* Quick Stats */}
          <View style={styles.section}>
            <QuickStats
              checkedInToday={userStats.checkedInToday}
              workoutsThisWeek={userStats.workoutsThisWeek}
              lastWorkout={userStats.lastWorkout}
              onCheckIn={handleCheckIn}
            />
          </View>

          {/* Subscription Card */}
          <View style={styles.section}>
            <SubscriptionCard
              planName={subscription.planName}
              status={subscription.status}
              expiryDate={subscription.expiryDate}
              daysRemaining={subscription.daysRemaining}
              onRenew={handleRenewSubscription}
              onUpgrade={handleUpgradeSubscription}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <QuickActions actions={getQuickActions()} />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 50,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    gap: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    textAlign: "left",
  },
  trustText: {
    color: Colors.info,
  },
  gymText: {
    color: Colors.black,
  },
  profileButton: {
    position: "relative",
    padding: 4,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  profileText: {
    fontSize: 20,
    color: Colors.gray600,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "600",
  },
  headerBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  greetingContainer: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  motivationalText: {
    fontSize: 14,
    color: Colors.textSubtle,
    fontStyle: "italic",
    letterSpacing: -0.1,
  },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  weatherIcon: {
    fontSize: 16,
  },
  weatherText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.textSubtle,
    marginBottom: 24,
  },
});
