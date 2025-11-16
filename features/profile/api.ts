import { UserProfile } from "@/entities/User";
import { SessionManager } from "@/services/SessionManager";

const API_BASE_URL = "http://192.168.1.18:3000/api/member";
const FILES_API_BASE_URL = "http://192.168.1.18:3000/api/files";

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

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// Upload file to AWS S3
export const uploadFile = async (file: {
  uri: string;
  type: string;
  name: string;
}): Promise<UploadFileResponse> => {
  const sessionManager = SessionManager.getInstance();
  const currentSession = sessionManager.getSessionState();

  const formData = new FormData();

  // Create the file object for React Native with proper format
  // React Native requires this specific format for file uploads
  const fileObject = {
    uri: file.uri,
    type: file.type || "image/jpeg", // Default to JPEG if type is missing
    name: file.name || `image_${Date.now()}.jpg`, // Generate name if missing
  };

  formData.append("file", fileObject as any);

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

    if (!response.ok) {
      const errorText = await response.text();

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Upload failed" };
      }

      const errorMessage =
        errorData.message ||
        errorData.en ||
        `Upload failed with status ${response.status}`;

      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
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

  const response = await fetch(
    `${API_BASE_URL}/profile/${currentSession.user.id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || errorData.en || "Failed to fetch profile";
    throw new Error(errorMessage);
  }

  const result = await response.json();

  // Transform the backend response to match UserProfile interface
  const userProfile: UserProfile = {
    id: result.id,
    firstName: result.firstName,
    lastName: result.lastName,
    email: result.email,
    phone: result.phone,
    address: result.address,
    city: result.city,
    profession: result.profession,
    // Use memberImage.imageUrl if available, otherwise undefined
    imageUrl: result.memberImage?.imageUrl || undefined,
    status: result.status,
    role: result.role,
    partner: result.partner,
    gym: result.gym,
  };

  return userProfile;
};

// Refresh current user profile in session
export const refreshUserProfileInSession = async (): Promise<void> => {
  try {
    const updatedProfile = await getCurrentUserProfile();

    const sessionManager = SessionManager.getInstance();
    await sessionManager.updateUserProfile(updatedProfile);
  } catch (error) {
    console.error("Failed to refresh user profile in session:", error);
  }
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

// Change member password
export const changeMemberPassword = async (
  payload: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const response = await fetch(`${API_BASE_URL}/password/change`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || errorData.en || "Failed to change password";
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result;
};
