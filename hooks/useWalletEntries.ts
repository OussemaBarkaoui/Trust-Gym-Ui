import { WalletEntry } from "@/entities/WalletEntry";
import { getWalletEntries } from "@/features/wallet/api";
import { showError } from "@/utils/showMessage";
import { useEffect, useState } from "react";

export const useWalletEntries = () => {
  const [entries, setEntries] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWalletEntries = async () => {
    try {
      setLoading(true);
      const response = await getWalletEntries();
      setEntries(response);
    } catch (error: any) {
      console.error("Failed to fetch wallet entries:", error);
      showError(error.message || "Failed to load wallet entries");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletEntries();
  }, []);

  const refreshEntries = async () => {
    await fetchWalletEntries();
  };

  // Calculate total income for the current month
  const getMonthlyIncome = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return entries
      .filter((entry) => {
        const entryDate = new Date(entry.date || entry.createdAt);
        return (
          entryDate.getMonth() === currentMonth &&
          entryDate.getFullYear() === currentYear &&
          entry.amount > 0 // Only count positive amounts as income
        );
      })
      .reduce((total, entry) => total + entry.amount, 0);
  };

  // Get all income entries for the current month
  const getMonthlyIncomeEntries = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return entries.filter((entry) => {
      const entryDate = new Date(entry.date || entry.createdAt);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear &&
        entry.amount > 0
      );
    });
  };

  return {
    entries,
    loading,
    refreshEntries,
    getMonthlyIncome,
    getMonthlyIncomeEntries,
  };
};
