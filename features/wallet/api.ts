import { Wallet } from "@/entities/Wallet";
import { WalletEntry } from "@/entities/WalletEntry";
import { SessionManager } from "@/services/SessionManager";

const API_BASE_URL = "http://192.168.1.18:3000/api/wallet"; // Add your API base URL here
const API_BASE_URL_WALLET_ENTRY = "http://192.168.1.18:3000/api/member";
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

export interface WalletTransaction {
  amount: number;
  description?: string;
}

export interface WalletResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface WalletEntriesResponse {
  data: WalletEntry[];
  totalItems: number;
  statusCode: number;
  message: string;
}

// Get wallet information for a member
export const getWallet = async (memberId: string): Promise<Wallet> => {
  const response = await fetch(`${API_BASE_URL}/member/${memberId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log(`❌ Error data:`, errorData);

    const errorMessage =
      errorData.message || errorData.en || "Failed to fetch wallet information";
    console.log(`❌ Error message: ${errorMessage}`);

    // Check if the error is specifically about not having a wallet
    if (
      errorMessage.includes("does not have a wallet") ||
      errorMessage.includes("Member does not have a wallet") ||
      response.status === 400 ||
      response.status === 404
    ) {
      throw new Error("WALLET_NOT_FOUND");
    }

    throw new Error(errorMessage);
  }

  const walletData = await response.json();
  return walletData;
};

// Deposit money to wallet
export const depositToWallet = async (
  memberId: string,
  amount: number,
  description?: string
): Promise<WalletResponse> => {
  const response = await fetch(`${API_BASE_URL}/deposit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      memberId,
      amount,
      description: description || "Wallet Deposit",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to deposit money to wallet");
  }

  return response.json();
};

// Withdraw money from wallet
export const withdrawFromWallet = async (
  memberId: string,
  amount: number,
  description?: string
): Promise<WalletResponse> => {
  const response = await fetch(`${API_BASE_URL}/withdraw`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      memberId,
      amount,
      description: description || "Wallet Withdrawal",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to withdraw money from wallet");
  }

  return response.json();
};

// Get wallet transaction history
export const getWalletTransactions = async (
  memberId: string
): Promise<WalletEntry[]> => {
  const response = await fetch(
    `${API_BASE_URL}/member/${memberId}/transactions`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch wallet transactions");
  }

  return response.json();
};

// Get wallet entries for the current member
export const getWalletEntries = async (): Promise<WalletEntry[]> => {
  const response = await fetch(`${API_BASE_URL_WALLET_ENTRY}/wallet-entries`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wallet entries");
  }

  const responseData = await response.json();
  console.log("Wallet entries response:", responseData);

  // Handle the response structure: { data: [], totalItems: 0, statusCode: 200, message: "..." }
  return responseData.data || [];
};

// Create wallet for a member
export const createWallet = async (
  memberId: string,
  initialAmount: number = 0,
  partnerId?: string
): Promise<WalletResponse> => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      memberId,
      amount: initialAmount,
      ...(partnerId && { partnerId }),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create wallet");
  }

  return response.json();
};
