import { SessionManager } from "@/services/SessionManager";

const API_BASE_URL = "http://192.168.137.1:3000/api/member-purchase";

// Function to get auth headers
const getAuthHeaders = () => {
  const sessionManager = SessionManager.getInstance();
  const currentSession = sessionManager.getSessionState();

  return {
    "Content-Type": "application/json",
    ...(currentSession.accessToken && {
      Authorization: `Bearer ${currentSession.accessToken}`,
    }),
  };
};

export interface MemberPurchase {
  id: string;
  quantity: number;
  total: string;
  isPaid: boolean;
  paymentMethod: string;
  createdAt: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    unitPrice: number;
  };
  gym: {
    id: string;
    location: string;
  };
}

export interface MemberPurchasesResponse {
  data: MemberPurchase[];
  totalItems: number;
  statusCode: number;
  message: string;
}

export const getMemberPurchases =
  async (): Promise<MemberPurchasesResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/member/purchase`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("getMemberPurchases response:", data);
      return data;
    } catch (error) {
      console.error("Error fetching member purchases:", error);
      throw error;
    }
  };

export const getMemberPurchaseById = async (
  purchaseId: string
): Promise<MemberPurchase> => {
  try {
    const url = `${API_BASE_URL}/${purchaseId}`;
    console.log("Fetching purchase from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log("Parsed response data:", responseData);

    // Extract the actual purchase data from the response
    return responseData.data;
  } catch (error) {
    console.error("Error fetching member purchase by ID:", error);
    throw error;
  }
};
