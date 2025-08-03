import { SessionManager } from "@/services/SessionManager";
import { UserProfile } from "@/entities/User";

const API_BASE_URL = "http://192.168.3.215:3000/api/member";
const FILES_API_BASE_URL = "http://192.168.3.215:3000/api/files";

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

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  profession?: string;
  memberImage?: {
    fileName: string;
    imageUrl: string;
  };
}

export interface UpdateProfileResponse {
  message: string;
}

export interface UploadFileResponse {
  message: string;
  fileName: string;
  fileUrl: string;
}

// Upload file to AWS S3
export const uploadFile = async (file: {
  uri: string;
  type: string;
  name: string;
}): Promise<UploadFileResponse> => {
  console.log('🚀 Starting file upload...');
  console.log('📝 File details:', { uri: file.uri, type: file.type, name: file.name });
  
  const sessionManager = SessionManager.getInstance();
  const currentSession = sessionManager.getSessionState();

  // First test backend connectivity
  console.log('🔍 Testing backend connection...');
  try {
    const testResponse = await fetch(`${FILES_API_BASE_URL.replace('/upload', '')}/health`, {
      method: "GET",
    });
    console.log('🔍 Backend health check:', testResponse.status);
  } catch (error) {
    console.log('⚠️ Backend health check failed:', error);
  }

  const formData = new FormData();
  
  // Create the file object for React Native with proper format
  // React Native requires this specific format for file uploads
  const fileObject = {
    uri: file.uri,
    type: file.type || 'image/jpeg', // Default to JPEG if type is missing
    name: file.name || `image_${Date.now()}.jpg`, // Generate name if missing
  };
  
  console.log('📝 Formatted file object:', fileObject);
  
  formData.append('file', fileObject as any);

  console.log('🔍 Uploading file:', {
    name: file.name,
    type: file.type,
    uri: file.uri.substring(0, 50) + '...',
  });

  console.log('🔍 Uploading file to:', `${FILES_API_BASE_URL}/upload`);
  console.log('🔍 With headers:', {
    hasToken: !!currentSession.accessToken,
    tokenPreview: currentSession.accessToken?.substring(0, 20) + '...'
  });

  try {
    const response = await fetch(`${FILES_API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        ...(currentSession.accessToken && {
          Authorization: `Bearer ${currentSession.accessToken}`,
        }),
        // Don't set Content-Type for FormData - let React Native handle it
      },
      body: formData,
    });

    console.log('📡 Upload response status:', response.status);

    if (!response.ok) {
      console.error('❌ Upload failed - Status:', response.status);
      console.error('❌ Response headers:', JSON.stringify([...response.headers.entries()]));
      
      const errorText = await response.text();
      console.error('❌ Response body:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Upload failed' };
      }

      const errorMessage = 
        errorData.message || errorData.en || `Upload failed with status ${response.status}`;
      
      console.error('❌ Final error message:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Upload successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const sessionManager = SessionManager.getInstance();
  const currentSession = sessionManager.getSessionState();
  
  if (!currentSession.user?.id) {
    throw new Error("User ID not found in session");
  }

  const response = await fetch(`${API_BASE_URL}/profile/${currentSession.user.id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = 
      errorData.message || errorData.en || "Failed to fetch profile";
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result;
};

// Update member profile
export const updateMemberProfile = async (
  payload: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/profile/update`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = 
      errorData.message || errorData.en || "Failed to update profile";
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result;
};
