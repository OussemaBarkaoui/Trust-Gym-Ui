import { useState } from "react";
import * as authApi from "../features/(auth)/api";

export function useResetPasswordForm() {
  const [error, setError] = useState("");
  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    setError("");
    try {
      await authApi.resetPassword(email, otp, newPassword);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to reset password.");
      throw e;
    }
  };
  return { error, resetPassword };
}