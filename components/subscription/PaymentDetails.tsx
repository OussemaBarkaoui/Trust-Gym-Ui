import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import type { Payment } from '@/entities/MemberSubscription';

interface PaymentDetailsProps {
  subscriptionAmount: number;
  payments: Payment[];
  paidAmount?: string;
  remainingAmount?: number;
}

export const PaymentDetails = memo<PaymentDetailsProps>(({
  subscriptionAmount,
  payments,
  paidAmount,
  remainingAmount,
}) => {
  const paymentStats = useMemo(() => {
    const totalPayedAmount = payments?.reduce(
      (total, payment) => total + parseFloat(payment.payedAmount || '0'),
      0
    ) || 0;

    const calculatedRemainingAmount = Math.max(0, subscriptionAmount - totalPayedAmount);
    const progressPercentage = subscriptionAmount > 0 
      ? Math.min(100, (totalPayedAmount / subscriptionAmount) * 100) 
      : 0;

    return {
      totalPayedAmount,
      remainingAmount: calculatedRemainingAmount,
      progressPercentage,
    };
  }, [subscriptionAmount, payments]);

  const formatAmount = (amount: string | number): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${numAmount.toFixed(2)} DT`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Summary</Text>
      
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Subscription Amount:</Text>
        <Text style={styles.amountValue}>{formatAmount(subscriptionAmount)}</Text>
      </View>
      
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Paid Amount:</Text>
        <Text style={[styles.amountValue, styles.paidAmount]}>
          {formatAmount(paymentStats.totalPayedAmount)}
        </Text>
      </View>
      
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Remaining Amount:</Text>
        <Text style={[styles.amountValue, styles.remainingAmount]}>
          {formatAmount(paymentStats.remainingAmount)}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${paymentStats.progressPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {paymentStats.progressPercentage.toFixed(1)}% Paid
        </Text>
      </View>
    </View>
  );
});

PaymentDetails.displayName = 'PaymentDetails';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.textSubtle,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  paidAmount: {
    color: Colors.success,
  },
  remainingAmount: {
    color: Colors.error,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSubtle,
    textAlign: 'center',
  },
});
