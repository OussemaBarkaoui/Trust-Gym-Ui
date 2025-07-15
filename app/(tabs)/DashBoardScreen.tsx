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
  Logo,
  QuickActions,
  QuickStats,
  SubscriptionCard,
} from "../../components/ui";
import { Colors } from "../../constants/Colors";

const { width } = Dimensions.get('window');
import { useFadeIn, useSlideIn, useSubscription } from "../../hooks";

export default function DashBoardScreen() {
  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });
  const headerAnim = useRef(new Animated.Value(-50)).current;

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
    // Animate header entrance with reduced distance
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.white}
      />

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
          <View style={styles.logoContainer}>
            <Logo style={styles.headerLogo} animate={false} />
            <Text style={styles.headerTitle}>Trust Gym</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>👤</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content Area with animation */}
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
        >
          <Text style={styles.welcomeText}>Welcome to Trust Gym!</Text>
          <Text style={styles.subtitleText}>
            Your fitness journey starts here
          </Text>

          {/* Subscription Card */}
          <SubscriptionCard
            planName={subscription.planName}
            status={subscription.status}
            expiryDate={subscription.expiryDate}
            daysRemaining={subscription.daysRemaining}
            onRenew={handleRenewSubscription}
            onUpgrade={handleUpgradeSubscription}
          />

          {/* Quick Stats */}
          <QuickStats
            checkedInToday={userStats.checkedInToday}
            workoutsThisWeek={userStats.workoutsThisWeek}
            lastWorkout={userStats.lastWorkout}
            onCheckIn={handleCheckIn}
          />

          {/* Quick Actions */}
          <QuickActions actions={getQuickActions()} />
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
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flex: 1,
    gap: 4,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogo: {
    height: 28,
    width: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
  },
  userInfo: {
    gap: 2,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSubtle,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 18,
    color: Colors.gray600,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Add extra padding for bottom tabs
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
