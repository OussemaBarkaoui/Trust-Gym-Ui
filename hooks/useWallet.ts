import { Wallet } from "@/entities/Wallet";
import { WalletEntry } from "@/entities/WalletEntry";
import {
  depositToWallet,
  getWallet,
  getWalletTransactions,
  withdrawFromWallet,
} from "@/features/wallet/api";
import { showError, showSuccess } from "@/utils/showMessage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export const useWallet = (memberId: string) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch wallet information
  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      const walletData = await getWallet(memberId);
      setWallet(walletData);
    } catch (error) {
      showError("Failed to fetch wallet information");
      console.error("Wallet fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  // Fetch transaction history
  const fetchTransactions = useCallback(async () => {
    try {
      const transactionData = await getWalletTransactions(memberId);
      setTransactions(transactionData);
    } catch (error) {
      showError("Failed to fetch transaction history");
      console.error("Transaction fetch error:", error);
    }
  }, [memberId]);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      
      fetchWallet();
      fetchTransactions();
    }, [fetchWallet, fetchTransactions])
  );

  // Auto-refresh every 30 seconds when screen is active
  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        fetchWallet();
        fetchTransactions();
      }, 30000);

      return () => clearInterval(interval);
    }, [fetchWallet, fetchTransactions])
  );

  // Deposit money
  const deposit = async (amount: number, description?: string) => {
    try {
      setLoading(true);
      await depositToWallet(memberId, amount, description);
      showSuccess("Deposit successful!");
      // Refresh wallet and transactions
      await fetchWallet();
      await fetchTransactions();
    } catch (error) {
      showError("Deposit failed. Please try again.");
      console.error("Deposit error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Withdraw money
  const withdraw = async (amount: number, description?: string) => {
    try {
      setLoading(true);
      await withdrawFromWallet(memberId, amount, description);
      showSuccess("Withdrawal successful!");
      // Refresh wallet and transactions
      await fetchWallet();
      await fetchTransactions();
    } catch (error) {
      showError("Withdrawal failed. Please try again.");
      console.error("Withdrawal error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    wallet,
    transactions,
    loading,
    fetchWallet,
    fetchTransactions,
    deposit,
    withdraw,
  };
};
