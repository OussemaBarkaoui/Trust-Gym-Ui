import { useMemo } from 'react';
import type { MemberSubscription } from '@/entities/MemberSubscription';
import type { StatusType } from '@/types/common';

/**
 * Hook for subscription utility functions with memoization
 */
export const useSubscriptionUtils = () => {
  return useMemo(() => ({
    /**
     * Format date to readable string
     */
    formatDate: (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },

    /**
     * Format amount with currency
     */
    formatAmount: (amount: string | number): string => {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      return `${numAmount.toFixed(2)} DT`;
    },

    /**
     * Get subscription status
     */
    getSubscriptionStatus: (subscription: MemberSubscription): StatusType => {
      const currentDate = new Date();
      const startDate = new Date(subscription.startDate);
      const endDate = new Date(subscription.endDate);

      if (currentDate < startDate) {
        return 'upcoming';
      } else if (currentDate >= startDate && currentDate <= endDate) {
        return 'active';
      } else {
        return 'expired';
      }
    },

    /**
     * Get days remaining for subscription
     */
    getDaysRemaining: (subscription: MemberSubscription): number => {
      const currentDate = new Date();
      const endDate = new Date(subscription.endDate);
      const timeDiff = endDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff > 0 ? daysDiff : 0;
    },

    /**
     * Calculate total paid amount from payments
     */
    calculateTotalPaidAmount: (subscription: MemberSubscription): number => {
      if (!subscription?.payments || subscription.payments.length === 0) {
        return 0;
      }
      return subscription.payments.reduce(
        (total, payment) => total + parseFloat(payment.payedAmount || '0'),
        0
      );
    },

    /**
     * Calculate remaining amount
     */
    calculateRemainingAmount: (subscription: MemberSubscription): number => {
      const subscriptionAmount = subscription.subscriptionAmount || 0;
      const totalPaid = subscription.payments?.reduce(
        (total, payment) => total + parseFloat(payment.payedAmount || '0'),
        0
      ) || 0;
      return Math.max(0, subscriptionAmount - totalPaid);
    },
  }), []);
};
