import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { MemberPurchase } from "../features/purchases/api";
import { useFadeIn, useMemberPurchases, useSlideIn } from "../hooks";

export default function AllPurchasesScreen() {
  const { purchases, loading, totalItems, refreshPurchases } =
    useMemberPurchases();
  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: string) => {
    return `${parseFloat(amount).toFixed(2)}DT`;
  };

  const handlePurchasePress = (purchase: MemberPurchase) => {
    router.push(`/PurchaseDetailsScreen?id=${purchase.id}`);
  };

  const renderPurchaseItem = ({ item }: { item: MemberPurchase }) => (
    <TouchableOpacity
      style={styles.purchaseItem}
      onPress={() => handlePurchasePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.purchaseHeader}>
        <View style={styles.purchaseInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.product.name}
          </Text>
          <Text style={styles.purchaseDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.purchaseAmount}>
          <Text style={styles.amountText}>{formatAmount(item.total)}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: item.isPaid
                    ? Colors.success
                    : Colors.warning,
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: item.isPaid ? Colors.success : Colors.warning },
              ]}
            >
              {item.isPaid ? "Paid" : "Pending"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.purchaseDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="cube-outline" size={14} color={Colors.textSubtle} />
          <Text style={styles.detailText}>Qty: {item.quantity}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="card-outline" size={14} color={Colors.textSubtle} />
          <Text style={styles.detailText}>{item.paymentMethod}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons
            name="location-outline"
            size={14}
            color={Colors.textSubtle}
          />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.gym.location}
          </Text>
        </View>
      </View>

    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color={Colors.textSubtle} />
      <Text style={styles.emptyTitle}>No Purchases Found</Text>
      <Text style={styles.emptyDescription}>
        You haven't made any purchases yet. Start shopping to see your purchase
        history here!
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading your purchases...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Purchases</Text>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Purchases</Text>
            <Text style={styles.summaryValue}>{totalItems}</Text>
          </View>
        </View>

        {/* Purchases List */}
        {loading ? (
          renderLoadingState()
        ) : (
          <FlatList
            data={purchases}
            renderItem={renderPurchaseItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={refreshPurchases}
            ListEmptyComponent={renderEmptyState}
          />
        )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "center",
    alignItems: "center",
    right: 100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    right: 15,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 14,
    color: Colors.textSubtle,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  purchaseItem: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  purchaseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  purchaseInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  purchaseDate: {
    fontSize: 12,
    color: Colors.textSubtle,
  },
  purchaseAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  purchaseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 30,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSubtle,
    marginLeft: 4,
  },
  chevronContainer: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSubtle,
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSubtle,
  },
});
