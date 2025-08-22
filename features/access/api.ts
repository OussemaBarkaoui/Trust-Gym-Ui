import { Access } from "@/entities/Access";
import { SessionManager } from "@/services/SessionManager";

const API_BASE_URL = "http://192.168.137.1:3000/api/access"; // Adjust the base URL as needed

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

export interface AccessHistoryResponse {
  data: Access[];
  totalItems: number;
  statusCode: number;
  message: string;
}

export const getMemberAccessHistory =
  async (): Promise<AccessHistoryResponse> => {
    try {
      console.log("Fetching member access history...");

      const response = await fetch(`${API_BASE_URL}/member/history`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      console.log("Access history response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const responseData: AccessHistoryResponse = await response.json();
      console.log("Access history response data:", responseData);

      return responseData;
    } catch (error) {
      console.error("Error fetching access history:", error);
      throw error;
    }
  };
