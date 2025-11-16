import { MemberSubscription } from "@/entities/MemberSubscription";
import { getMemberSubscriptions } from "@/features/subscriptions/api";
import type { StatusType } from "@/types/common";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseMemberSubscriptionsReturn {
  subscriptions: MemberSubscription[];
  currentSubscription: MemberSubscription | undefined;
  loading: boolean;
  error: string | null;
  refreshSubscriptions: () => void;
  getSubscriptionStatus: (subscription: MemberSubscription) => StatusType;
  getDaysRemaining: (subscription: MemberSubscription) => number;
}

export const useMemberSubscriptions = (): UseMemberSubscriptionsReturn => {
  const [subscriptions, setSubscriptions] = useState<MemberSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMemberSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      console.error("Error fetching member subscriptions:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch subscriptions";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSubscriptions = useCallback(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Memoize the current active subscription
  const currentSubscription = useMemo((): MemberSubscription | undefined => {
    return subscriptions.find((subscription) => {
      const currentDate = new Date();
      const endDate = new Date(subscription.endDate);
      return endDate >= currentDate;
    });
  }, [subscriptions]);

  // Memoized utility functions
  const getSubscriptionStatus = useCallback(
    (subscription: MemberSubscription): StatusType => {
      const currentDate = new Date();
      const startDate = new Date(subscription.startDate);
      const endDate = new Date(subscription.endDate);

      if (currentDate < startDate) {
        return "upcoming";
      } else if (currentDate >= startDate && currentDate <= endDate) {
        return "active";
      } else {
        return "expired";
      }
    },
    []
  );

  // Get days remaining for current subscription
  const getDaysRemaining = useCallback(
    (subscription: MemberSubscription): number => {
      const currentDate = new Date();
      const endDate = new Date(subscription.endDate);
      const timeDiff = endDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff > 0 ? daysDiff : 0;
    },
    []
  );

  return {
    subscriptions,
    currentSubscription,
    loading,
    error,
    refreshSubscriptions,
    getSubscriptionStatus,
    getDaysRemaining,
  };
};
