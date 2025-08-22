import { router } from "expo-router";
import React from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { AppHeader, QuickActions, SubscriptionCard } from "../../components/ui";
import { Colors } from "../../constants/Colors";
import { useSession } from "../../contexts/SessionContext";
import {
  useFadeIn,
  useMemberSubscriptions,
  useSlideIn,
  useSubscription,
} from "../../hooks";
import { showMessage } from "../../utils/showMessage";

export default function DashBoardScreen() {
  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });

  const { session } = useSession();

  const {
    subscription,
    userStats,
    isLoading,
    renewSubscription,
    upgradeSubscription,
    checkIn,
    getQuickActions,
  } = useSubscription();

  const {
    subscriptions,
    currentSubscription,
    loading: subscriptionsLoading,
    error: subscriptionsError,
    refreshSubscriptions,
    getSubscriptionStatus,
    getDaysRemaining,
  } = useMemberSubscriptions();

  const handleRenewSubscription = async () => {
    const result = await renewSubscription();
    showMessage({
      title: result.success ? "Success" : "Error",
      message: result.message,
      type: result.success ? "success" : "error",
    });
  };

  const handleUpgradeSubscription = async () => {
    const result = await upgradeSubscription();
    showMessage({
      title: result.success ? "Success" : "Error",
      message: result.message,
      type: result.success ? "success" : "error",
    });
  };

  const handleCheckIn = async () => {
    const result = await checkIn();
    showMessage({
      title: result.success ? "Success" : "Error",
      message: result.message,
      type: result.success ? "success" : "error",
    });
  };

  const handleSubscriptionPress = () => {
    router.push("/SubscriptionDetailsScreen");
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

  const headerTitle = `${getGreeting()}, ${session.user?.firstName || "User"}!`;
  const headerSubtitle = getMotivationalMessage();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <AppHeader title={headerTitle} subtitle={headerSubtitle} />

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
          bounces={false}
          overScrollMode="never"
        >
          {/* Current Subscription */}
          <View style={styles.section}>
            <SubscriptionCard
              subscription={currentSubscription}
              loading={subscriptionsLoading}
              onPress={handleSubscriptionPress}
              getSubscriptionStatus={getSubscriptionStatus}
              getDaysRemaining={getDaysRemaining}
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
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
});
