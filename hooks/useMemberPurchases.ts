import { useState, useEffect } from "react";
import { getMemberPurchases, MemberPurchase, MemberPurchasesResponse } from "@/features/purchases/api";
import { showError } from "@/utils/showMessage";

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

  return {
    purchases,
    loading,
    totalItems,
    refreshPurchases,
    getRecentPurchases,
  };
};
