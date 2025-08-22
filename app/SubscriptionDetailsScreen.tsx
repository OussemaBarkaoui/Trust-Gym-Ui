import React, { memo, useMemo } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useMemberSubscriptions, useSubscriptionUtils } from '@/hooks';
import { StatusBadge, PaymentDetails } from '@/components/subscription';
import type { MemberSubscription } from '@/entities/MemberSubscription';

interface SubscriptionHeaderProps {
  onBackPress: () => void;
}

const SubscriptionHeader = memo<SubscriptionHeaderProps>(({ onBackPress }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
      <Ionicons name="arrow-back" size={24} color={Colors.text} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Subscription Details</Text>
    <View style={styles.headerRight} />
  </View>
));

SubscriptionHeader.displayName = 'SubscriptionHeader';

interface LoadingStateProps {
  onBackPress: () => void;
}

const LoadingState = memo<LoadingStateProps>(({ onBackPress }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
    <SubscriptionHeader onBackPress={onBackPress} />
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading subscription details...</Text>
    </View>
  </SafeAreaView>
));

LoadingState.displayName = 'LoadingState';

interface EmptyStateProps {
  onBackPress: () => void;
  onRefresh: () => void;
}

const EmptyState = memo<EmptyStateProps>(({ onBackPress, onRefresh }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
    <SubscriptionHeader onBackPress={onBackPress} />
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={80} color={Colors.textSubtle} />
      <Text style={styles.emptyTitle}>No Subscription Found</Text>
      <Text style={styles.emptyText}>
        You don't have any subscriptions to display.
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Ionicons name="refresh" size={18} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  </SafeAreaView>
));

EmptyState.displayName = 'EmptyState';

export default function SubscriptionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    subscriptions,
    loading,
    error,
    refreshSubscriptions,
    getSubscriptionStatus,
    getDaysRemaining,
  } = useMemberSubscriptions();
  
  const {
    formatDate,
    formatAmount,
    getSubscriptionStatus: utilsGetSubscriptionStatus,
    getDaysRemaining: utilsGetDaysRemaining,
  } = useSubscriptionUtils();

  // Memoize subscription finding logic
  const subscription = useMemo((): MemberSubscription | undefined => {
    if (!subscriptions.length) return undefined;
    
    if (id) {
      return subscriptions.find((sub) => sub.id === id);
    }
    
    // Find current active or upcoming subscription
    return subscriptions.find((sub) => {
      const status = getSubscriptionStatus(sub);
      return status === 'active' || status === 'upcoming';
    }) || subscriptions[0];
  }, [subscriptions, id, getSubscriptionStatus]);

  // Memoize subscription calculations
  const subscriptionData = useMemo(() => {
    if (!subscription) return null;
    
    const status = utilsGetSubscriptionStatus(subscription);
    const daysRemaining = utilsGetDaysRemaining(subscription);
    
    return {
      status,
      daysRemaining,
      formattedStartDate: formatDate(subscription.startDate),
      formattedEndDate: formatDate(subscription.endDate),
    };
  }, [subscription, utilsGetSubscriptionStatus, utilsGetDaysRemaining, formatDate]);

  const handleBackPress = () => {
    router.back();
  };

  const handleRefresh = () => {
    refreshSubscriptions();
  };

  if (loading) {
    return <LoadingState onBackPress={handleBackPress} />;
  }

  if (!subscription) {
    return <EmptyState onBackPress={handleBackPress} onRefresh={handleRefresh} />;
  }

  if (!subscriptionData) {
    return <EmptyState onBackPress={handleBackPress} onRefresh={handleRefresh} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <SubscriptionHeader onBackPress={handleBackPress} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subscription Header */}
        <View style={styles.subscriptionHeader}>
          <View style={styles.planInfo}>
            <Text style={styles.planName}>
              {subscription.gymSubscription.name}
            </Text>
            <StatusBadge 
              status={subscriptionData.status} 
              daysRemaining={subscriptionData.daysRemaining} 
            />
          </View>
          <Text style={styles.gymLocation}>{subscription.gym.location}</Text>
        </View>

        {/* Duration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Start Date</Text>
              <Text style={styles.detailValue}>
                {subscriptionData.formattedStartDate}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>End Date</Text>
              <Text style={styles.detailValue}>
                {subscriptionData.formattedEndDate}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Days Remaining</Text>
              <Text
                style={[
                  styles.detailValue,
                  {
                    color: subscriptionData.status === 'expired' ? Colors.error : Colors.success,
                  },
                ]}
              >
                {subscriptionData.status === 'expired' 
                  ? 'Expired' 
                  : `${subscriptionData.daysRemaining} days`
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Financial Section */}
        <PaymentDetails
          subscriptionAmount={subscription.subscriptionAmount}
          payments={subscription.payments || []}
          paidAmount={subscription.paidAmount}
          remainingAmount={subscription.remainingAmount}
        />

        {/* Member Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Member Information</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>
                {subscription.member.firstName} {subscription.member.lastName}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>
                {subscription.member.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Created</Text>
          <View style={styles.detailCard}>
            <Text style={styles.createdDate}>
              {formatDate(subscription.createdAt)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  refreshButton: {
    marginTop: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSubtle,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSubtle,
    textAlign: 'center',
  },
  subscriptionHeader: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textTransform: 'capitalize',
    flex: 1,
  },
  gymLocation: {
    fontSize: 14,
    color: Colors.textSubtle,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSubtle,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  createdDate: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
});
