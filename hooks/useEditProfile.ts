import { useSession } from "@/contexts/SessionContext";
import {
  getCurrentUserProfile,
  updateMemberProfile,
  UpdateProfileRequest,
} from "@/features/profile/api";
import { showError, showSuccess } from "@/utils/showMessage";
import { useState } from "react";

export const useEditProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { session, updateUserProfile } = useSession();

  const updateProfile = async (profileData: UpdateProfileRequest) => {
    try {
      setIsLoading(true);

      const result = await updateMemberProfile(profileData);

      // Fetch updated user profile
      const updatedProfile = await getCurrentUserProfile();

      // Update the session with the new profile data
      await updateUserProfile(updatedProfile);

      showSuccess(result.message || "Profile updated successfully!");

      return { success: true, data: result };
    } catch (error: any) {
      console.error("Profile update error:", error);
      showError(error.message || "Failed to update profile");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    currentUser: session.user,
  };
};
