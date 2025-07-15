import { useEffect, useState } from "react";
import { Colors } from "../constants/Colors";

interface SubscriptionData {
  planName: string;
  status: "active" | "expired" | "expiring";
  expiryDate: string;
  daysRemaining: number;
  startDate: string;
  price: number;
  features: string[];
}

interface UserStats {
  checkedInToday: boolean;
  workoutsThisWeek: number;
  lastWorkout: string;
  totalWorkouts: number;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionData>({
    planName: "Premium Monthly",
    status: "expiring",
    expiryDate: "2025-07-25",
    daysRemaining: 10,
    startDate: "2025-06-25",
    price: 49.99,
    features: [
      "Unlimited Access",
      "Personal Trainer",
      "Nutrition Plan",
      "Priority Support",
    ],
  });

  const [userStats, setUserStats] = useState<UserStats>({
    checkedInToday: false,
    workoutsThisWeek: 3,
    lastWorkout: "2 days ago",
    totalWorkouts: 47,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Calculate days remaining
    const today = new Date();
    const expiry = new Date(subscription.expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    setSubscription((prev) => ({
      ...prev,
      daysRemaining,
      status:
        daysRemaining <= 0
          ? "expired"
          : daysRemaining <= 7
          ? "expiring"
          : "active",
    }));
  }, [subscription.expiryDate]);

  const renewSubscription = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Extend subscription by 30 days
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + 30);

      setSubscription((prev) => ({
        ...prev,
        expiryDate: newExpiryDate.toISOString().split("T")[0],
        status: "active",
      }));

      return { success: true, message: "Subscription renewed successfully!" };
    } catch (error) {
      return { success: false, message: "Failed to renew subscription" };
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeSubscription = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubscription((prev) => ({
        ...prev,
        planName: "Premium Yearly",
        price: 399.99,
        features: [...prev.features, "VIP Access", "Exclusive Events"],
      }));

      return { success: true, message: "Subscription upgraded successfully!" };
    } catch (error) {
      return { success: false, message: "Failed to upgrade subscription" };
    } finally {
      setIsLoading(false);
    }
  };

  const checkIn = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUserStats((prev) => ({
        ...prev,
        checkedInToday: true,
        workoutsThisWeek: prev.workoutsThisWeek + 1,
        lastWorkout: "Today",
        totalWorkouts: prev.totalWorkouts + 1,
      }));

      return { success: true, message: "Checked in successfully!" };
    } catch (error) {
      return { success: false, message: "Failed to check in" };
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickActions = () => [
    {
      id: "book-class",
      title: "Book Class",
      icon: "calendar" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
      color: Colors.info,
      onPress: () => console.log("Book Class pressed"),
    },
    {
      id: "workout-plan",
      title: "Workout Plan",
      icon: "fitness" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
      color: Colors.success,
      onPress: () => console.log("Workout Plan pressed"),
    },
    {
      id: "nutrition",
      title: "Nutrition",
      icon: "nutrition" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
      color: Colors.warning,
      onPress: () => console.log("Nutrition pressed"),
    },
    {
      id: "trainer",
      title: "Find Trainer",
      icon: "person" as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap,
      color: Colors.primary,
      onPress: () => console.log("Find Trainer pressed"),
    },
  ];

  return {
    subscription,
    userStats,
    isLoading,
    renewSubscription,
    upgradeSubscription,
    checkIn,
    getQuickActions,
  };
};
