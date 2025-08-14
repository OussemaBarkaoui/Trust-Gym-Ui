import {
  changeMemberPassword,
  ChangePasswordRequest,
} from "@/features/profile/api";
import { showError, showSuccess } from "@/utils/showMessage";
import { useState } from "react";

export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const changePassword = async (passwordData: ChangePasswordRequest) => {
    try {
      setIsLoading(true);

      const result = await changeMemberPassword(passwordData);

      showSuccess(result.message || "Password changed successfully!");

      return { success: true, data: result };
    } catch (error: any) {
      console.error("Change password error:", error);
      showError(error.message || "Failed to change password");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
  };
};
