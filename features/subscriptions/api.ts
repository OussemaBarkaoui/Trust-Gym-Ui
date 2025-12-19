import {
  MemberSubscription,
  MemberSubscriptionsResponse,
} from "@/entities/MemberSubscription";
import type { ApiResponse } from "@/types/api";
import { apiClient } from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/api/endpoints";

/**
 * Get member subscriptions with improved error handling
 */
export const getMemberSubscriptions = async (): Promise<
  MemberSubscription[]
> => {
  try {
    console.log("[subscriptions] Fetching member subscriptions...");
    
    const response = await apiClient.get<MemberSubscriptionsResponse>(
      API_ENDPOINTS.MEMBER.SUBSCRIPTIONS,
      { timeout: 60000 } // 60 second timeout
    );

    console.log("[subscriptions] Response received:", response);
    
    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }
    
    if (response && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    
    return [];
  } catch (error) {
    console.error("[subscriptions] Error fetching member subscriptions:", error);

    // Re-throw with more specific error message
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch member subscriptions");
    }

    throw new Error("Failed to fetch member subscriptions");
  }
};

/**
 * Get subscription details by ID
 */
export const getSubscriptionDetails = async (
  id: string
): Promise<MemberSubscription> => {
  try {
    const response = await apiClient.get<ApiResponse<MemberSubscription>>(
      API_ENDPOINTS.SUBSCRIPTIONS.DETAILS(id)
    );

    if (!response.data) {
      throw new Error("Subscription not found");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching subscription details:", error);

    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch subscription details");
    }

    throw new Error("Failed to fetch subscription details");
  }
};

/**
 * Renew subscription
 */
export const renewSubscription = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      API_ENDPOINTS.SUBSCRIPTIONS.RENEW(id)
    );

    return response;
  } catch (error) {
    console.error("Error renewing subscription:", error);

    if (error instanceof Error) {
      throw new Error(error.message || "Failed to renew subscription");
    }

    throw new Error("Failed to renew subscription");
  }
};

/**
 * Upgrade subscription
 */
export const upgradeSubscription = async (
  id: string,
  newPlanId: string
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      API_ENDPOINTS.SUBSCRIPTIONS.UPGRADE(id),
      { newPlanId }
    );

    return response;
  } catch (error) {
    console.error("Error upgrading subscription:", error);

    if (error instanceof Error) {
      throw new Error(error.message || "Failed to upgrade subscription");
    }

    throw new Error("Failed to upgrade subscription");
  }
};
