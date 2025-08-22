import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppHeader, Input } from "../../components/ui";
import { Colors } from "../../constants/Colors";
import { useSession } from "../../contexts/SessionContext";
import { Wallet } from "../../entities/Wallet";
import { createWallet, getWallet } from "../../features/wallet/api";
import {
  useFadeIn,
  useMemberPurchases,
  useProductImage,
  useSlideIn,
  useWalletEntries,
} from "../../hooks";
import { showError, showSuccess } from "../../utils/showMessage";

export default function WalletScreen() {
  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });
  const { session } = useSession();
  const {
    getRecentPurchases,
    loading: purchasesLoading,
    refreshPurchases,
    getMonthlySpent,
    getMonthlyPending,
  } = useMemberPurchases();
  const {
    getMonthlyIncome,
    loading: entriesLoading,
    refreshEntries,
  } = useWalletEntries();

  // Component for transaction item with product image
  const TransactionItem = ({ transaction }: { transaction: any }) => {
    const {
      image: productImage,
      loading: imageLoading,
      error: imageError,
    } = useProductImage(transaction.productId);

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => handleTransactionPress(transaction.id)}
        activeOpacity={0.7}
      >
        {/* Product Image */}
        <View style={styles.transactionImageContainer}>
          {imageLoading ? (
            <View style={styles.transactionImagePlaceholder}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : productImage ? (
            <Image
              source={{ uri: productImage.imageUrl }}
              style={styles.transactionImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.transactionImagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={16}
                color={Colors.textSubtle}
              />
            </View>
          )}
        </View>

        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>
            {transaction.description}
          </Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionDate}>
              {new Date(transaction.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
            <View style={styles.paymentStatusContainer}>
              <View
                style={[
                  styles.paymentStatusDot,
                  {
                    backgroundColor: transaction.isPaid
                      ? Colors.success
                      : Colors.warning,
                  },
                ]}
              />
              <Text
                style={[
                  styles.paymentStatusText,
                  {
                    color: transaction.isPaid ? Colors.success : Colors.warning,
                  },
                ]}
              >
                {transaction.isPaid ? "Paid" : "Pending"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionAmountContainer}>
          <Text style={styles.transactionAmount}>
            {transaction.amount.toFixed(2)}DT
          </Text>
          <Text style={styles.paymentMethod}>{transaction.paymentMethod}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // State for wallet operations
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [operationType, setOperationType] = useState<"deposit" | "withdraw">(
    "deposit"
  );
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingWallet, setFetchingWallet] = useState(true);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [creatingWallet, setCreatingWallet] = useState(false);

  // Fetch wallet data function
  const fetchWalletData = useCallback(async () => {
    if (!session.user?.id) return;

    try {
      const walletData = await getWallet(session.user.id);
      setWallet(walletData);
      setWalletBalance(walletData.amount);
      setHasWallet(true);
    } catch (error: any) {
      console.error("❌ Failed to fetch wallet:", error);
      console.error("❌ Error message:", error.message);

      // Check for specific wallet not found error
      if (
        error.message === "WALLET_NOT_FOUND" ||
        error.message.includes("does not have a wallet") ||
        error.message.includes("Member does not have a wallet")
      ) {
        setHasWallet(false);
        setWallet(null);
        setWalletBalance(0);
      } else {
        // Other errors - still assume wallet exists but show error
        setHasWallet(true);
        showError("Failed to load wallet information");
      }
    }
  }, [session.user?.id]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchWalletData(),
      refreshPurchases(),
      refreshEntries(),
    ]);
    setRefreshing(false);
  }, [fetchWalletData, refreshPurchases, refreshEntries]);

  // Initial wallet data fetch
  useEffect(() => {
    const loadWallet = async () => {
      setFetchingWallet(true);
      await fetchWalletData();
      setFetchingWallet(false);
    };

    loadWallet();
  }, [fetchWalletData]);

  // Refresh wallet data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [fetchWalletData])
  );

  // Auto refresh wallet data every 30 seconds when screen is active
  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        fetchWalletData();
      }, 30000); // Refresh every 30 seconds

      return () => {
        clearInterval(interval);
      };
    }, [fetchWalletData])
  );

  // Create wallet function
  const handleCreateWallet = async () => {
    if (!session.user?.id) return;

    setCreatingWallet(true);
    try {
      const result = await createWallet(
        session.user.id,
        0,
        session.user.partner?.id
      );

      showSuccess("Wallet created successfully!");
      // Refresh wallet data after creation
      await fetchWalletData();
    } catch (error) {
      showError("Failed to create wallet. Please try again.");
    } finally {
      setCreatingWallet(false);
    }
  };

  const handleOpenModal = (type: "deposit" | "withdraw") => {
    setOperationType(type);
    setAmount("");
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setAmount("");
  };

  const handleTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showError("Please enter a valid amount");
      return;
    }

    const transactionAmount = parseFloat(amount);

    if (operationType === "withdraw" && transactionAmount > walletBalance) {
      showError("Insufficient balance");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (operationType === "deposit") {
        setWalletBalance((prev) => prev + transactionAmount);
        showSuccess(`Successfully deposited $${transactionAmount.toFixed(2)}`);
      } else {
        setWalletBalance((prev) => prev - transactionAmount);
        showSuccess(`Successfully withdrawn $${transactionAmount.toFixed(2)}`);
      }

      handleCloseModal();

      // Refresh wallet data after transaction
      setTimeout(() => {
        fetchWalletData();
      }, 1000);
    } catch (error) {
      showError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = ["25", "50", "100", "200"];

  // Transform recent purchases into transaction format
  const recentTransactions = getRecentPurchases().map((purchase) => ({
    id: purchase.id,
    type: "purchase" as const,
    amount: parseFloat(purchase.total),
    date: purchase.createdAt,
    description: purchase.product.name,
    isPaid: purchase.isPaid,
    paymentMethod: purchase.paymentMethod,
    productId: purchase.product.id,
  }));

  const handleViewAllTransactions = () => {
    router.push("/AllPurchasesScreen");
  };

  const handleTransactionPress = (transactionId: string) => {
    router.push(`/PurchaseDetailsScreen?id=${transactionId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <AppHeader
        title="My Wallet"
        subtitle="Manage your balance and payments"
      />

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
          overScrollMode="always"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        >
          {/* Check if user has wallet */}
          {hasWallet === false ? (
            // No Wallet - Show Create Wallet UI
            <View style={styles.noWalletContainer}>
              <View style={styles.noWalletCard}>
                <View style={styles.noWalletIcon}>
                  <Ionicons
                    name="wallet-outline"
                    size={60}
                    color={Colors.textSubtle}
                  />
                </View>
                <Text style={styles.noWalletTitle}>No Wallet Found</Text>
                <Text style={styles.noWalletSubtitle}>
                  You don't have a wallet yet. Create one to start managing your
                  balance.
                </Text>
                <TouchableOpacity
                  style={[
                    styles.createWalletButton,
                    creatingWallet && styles.disabledButton,
                  ]}
                  onPress={handleCreateWallet}
                  disabled={creatingWallet}
                >
                  <Ionicons name="add-circle" size={20} color={Colors.white} />
                  <Text style={styles.createWalletButtonText}>
                    {creatingWallet ? "Creating..." : "Create Wallet"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : hasWallet === true ? (
            // Has Wallet - Show Normal Wallet UI
            <>
              <View style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                  <View style={styles.walletIcon}>
                    <Ionicons name="wallet" size={28} color={Colors.primary} />
                  </View>
                  <View style={styles.balanceInfo}>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    {fetchingWallet ? (
                      <Text style={styles.balanceAmount}>Loading...</Text>
                    ) : (
                      <Text style={styles.balanceAmount}>
                        {walletBalance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        DT
                      </Text>
                    )}
                    <Text style={styles.balanceSubtext}>
                      Available to spend
                    </Text>
                  </View>
                </View>

                {/* Primary Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.depositButton]}
                    onPress={() => handleOpenModal("deposit")}
                  >
                    <Ionicons
                      name="add-circle"
                      size={20}
                      color={Colors.white}
                    />
                    <Text style={styles.actionButtonText}>Deposit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Recent Transactions */}
              <View style={styles.transactionsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Purchases</Text>
                  <TouchableOpacity onPress={handleViewAllTransactions}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>

                {purchasesLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>
                      Loading transactions...
                    </Text>
                  </View>
                ) : recentTransactions.length === 0 ? (
                  <View style={styles.emptyTransactions}>
                    <Ionicons
                      name="receipt-outline"
                      size={32}
                      color={Colors.textSubtle}
                    />
                    <Text style={styles.emptyTransactionsText}>
                      No recent transactions
                    </Text>
                  </View>
                ) : (
                  recentTransactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))
                )}
              </View>

              {/* Wallet Stats */}
              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Wallet Stats</Text>

                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: Colors.success + "20" },
                      ]}
                    >
                      <Ionicons
                        name="trending-up"
                        size={20}
                        color={Colors.success}
                      />
                    </View>
                    <Text style={styles.statLabel}>IN</Text>
                    <Text style={styles.statValue}>
                      {entriesLoading ? "..." : getMonthlyIncome().toFixed(2)}DT
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: Colors.error + "20" },
                      ]}
                    >
                      <Ionicons
                        name="trending-down"
                        size={20}
                        color={Colors.error}
                      />
                    </View>
                    <Text style={styles.statLabel}>OUT</Text>
                    <Text style={styles.statValue}>
                      {purchasesLoading ? "..." : getMonthlySpent().toFixed(2)}
                      DT
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: Colors.warning + "20" },
                      ]}
                    >
                      <Ionicons
                        name="hourglass-outline"
                        size={20}
                        color={Colors.warning}
                      />
                    </View>
                    <Text style={styles.statLabel}>PENDING</Text>
                    <Text style={styles.statValue}>
                      {purchasesLoading
                        ? "..."
                        : getMonthlyPending().toFixed(2)}
                      DT
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            // Loading state
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading wallet...</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {operationType === "deposit"
                  ? "Deposit Money"
                  : "Withdraw Money"}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={Colors.textSubtle} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.amountLabel}>Enter Amount</Text>
              <Input
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                prefix="$"
                autoFocus={true}
              />

              {/* Quick Amount Buttons */}
              <Text style={styles.quickAmountLabel}>Quick amounts</Text>
              <View style={styles.quickAmountButtons}>
                {quickAmounts.map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    style={styles.quickAmountButton}
                    onPress={() => setAmount(quickAmount)}
                  >
                    <Text style={styles.quickAmountText}>${quickAmount}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {operationType === "withdraw" && (
                <Text style={styles.balanceInfo}>
                  Available balance: ${walletBalance.toFixed(2)}
                </Text>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  operationType === "deposit"
                    ? styles.depositButton
                    : styles.withdrawButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleTransaction}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading
                    ? "Processing..."
                    : operationType === "deposit"
                    ? "Deposit"
                    : "Withdraw"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  balanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  walletIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textSubtle,
    marginBottom: 4,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 2,
  },
  balanceSubtext: {
    fontSize: 12,
    color: Colors.textDisabled,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  depositButton: {
    backgroundColor: Colors.success,
  },
  withdrawButton: {
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  transactionsSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textSubtle,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  statsSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  statItem: {
    flex: 1,
    minWidth: 90,
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSubtle,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  quickAmountLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSubtle,
    marginTop: 16,
    marginBottom: 12,
  },
  quickAmountButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  quickAmountText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.textSubtle,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  // No Wallet Styles
  noWalletContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  noWalletCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  noWalletIcon: {
    marginBottom: 24,
  },
  noWalletTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  noWalletSubtitle: {
    fontSize: 16,
    color: Colors.textSubtle,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  createWalletButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  createWalletButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  // Purchase Transactions Styles
  emptyTransactions: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTransactionsText: {
    marginTop: 8,
    color: Colors.textSubtle,
    fontSize: 14,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  paymentStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  paymentMethod: {
    fontSize: 12,
    color: Colors.textSubtle,
    marginTop: 2,
  },
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSubtle,
  },
  // Transaction Image Styles
  transactionImageContainer: {
    marginRight: 12,
  },
  transactionImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
  },
  transactionImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
});
