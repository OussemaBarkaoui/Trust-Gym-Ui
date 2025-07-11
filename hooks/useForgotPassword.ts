import { useState } from "react";
import * as authApi from "../features/(auth)/api";

export function useOtpVerificationForm() {
  const [error, setError] = useState("");
  const forgotPassword = async (email: string) => {
    setError("");
    try {
      await authApi.forgotPassword(email); // This should call an endpoint that just verifies OTP
    } catch (e: any) {
      setError(e.response?.data?.message || "Invalid OTP.");
      throw e;
    }
  };
  return { error, forgotPassword };
}