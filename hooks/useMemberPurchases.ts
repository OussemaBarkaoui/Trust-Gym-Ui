import {
  getMemberPurchases,
  MemberPurchase,
  MemberPurchasesResponse,
} from "@/features/purchases/api";
import { showError } from "@/utils/showMessage";
import { useEffect, useState } from "react";

export const useMemberPurchases = () => {
  const [purchases, setPurchases] = useState<MemberPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response: MemberPurchasesResponse = await getMemberPurchases();
      setPurchases(response.data);
      setTotalItems(response.totalItems);
    } catch (error: any) {
      console.error("Failed to fetch purchases:", error);
      showError(error.message || "Failed to load purchases");
      setPurchases([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const refreshPurchases = async () => {
    await fetchPurchases();
  };

  // Get recent purchases (last 4)
  const getRecentPurchases = () => {
    return purchases.slice(0, 4);
  };

  // Calculate total spent for the current month (only paid purchases)
  const getMonthlySpent = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.createdAt);
        return (
          purchaseDate.getMonth() === currentMonth &&
          purchaseDate.getFullYear() === currentYear &&
          purchase.isPaid === true // Only count paid purchases
        );
      })
      .reduce((total, purchase) => total + parseFloat(purchase.total), 0);
  };

  // Calculate total pending amount for the current month
  const getMonthlyPending = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.createdAt);
        return (
          purchaseDate.getMonth() === currentMonth &&
          purchaseDate.getFullYear() === currentYear &&
          purchase.isPaid === false // Only count pending purchases
        );
      })
      .reduce((total, purchase) => total + parseFloat(purchase.total), 0);
  };

  return {
    purchases,
    loading,
    totalItems,
    refreshPurchases,
    getRecentPurchases,
    getMonthlySpent,
    getMonthlyPending,
  };
};
