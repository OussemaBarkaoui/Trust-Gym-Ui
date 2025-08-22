import { useCallback, useEffect, useState } from "react";
import { Access } from "../entities/Access";
import { getMemberAccessHistory } from "../features/access/api";

export const useAccessHistory = () => {
  const [accessHistory, setAccessHistory] = useState<Access[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching access history...");

      const response = await getMemberAccessHistory();

      console.log("Access history fetched:", response);
      setAccessHistory(response.data);
      setTotalItems(response.totalItems);
    } catch (error: any) {
      console.error("Failed to fetch access history:", error);
      setError(error.message || "Failed to load access history");
      setAccessHistory([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAccessHistory = useCallback(async () => {
    await fetchAccessHistory();
  }, [fetchAccessHistory]);

  useEffect(() => {
    fetchAccessHistory();
  }, [fetchAccessHistory]);

  return {
    accessHistory,
    loading,
    totalItems,
    error,
    refreshAccessHistory,
  };
};
