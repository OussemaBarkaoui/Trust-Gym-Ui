import { SessionManager } from "@/services/SessionManager";

const API_BASE_URL = "http://10.58.235.215:3000/api/product"; // Adjust the base URL as needed

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

export interface ProductImage {
  id: string;
  fileName: string;
  imageUrl: string;
}

export interface ProductImageResponse {
  statusCode: number;
  data: ProductImage;
}

export const getProductImageById = async (
  id: string
): Promise<ProductImage> => {
  try {
    console.log("Fetching product image for ID:", id);

    const response = await fetch(`${API_BASE_URL}/image/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    console.log("Product image response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const responseData: ProductImageResponse = await response.json();
    console.log("Product image response data:", responseData);

    // Extract the actual image data from the response
    return responseData.data;
  } catch (error) {
    console.error("Error fetching product image:", error);
    throw error;
  }
};
