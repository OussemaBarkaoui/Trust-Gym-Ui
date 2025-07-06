import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Logo } from "../../components/ui/Logo";
import { OtpInput } from "../../components/ui/OtpInput";
import { useOtpVerificationForm } from "@/hooks/useOtpVerificationForm"; // This should just verify OTP

export default function OtpVerificationScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { error, verifyOtp } = useOtpVerificationForm();

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Enter the 6-digit OTP sent to your email.");
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      router.push({ pathname:"/(auth)/SetNewPasswordScreen", params: { email, otp } });
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Logo />
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Check your email for a 6-digit code.</Text>
      <OtpInput value={otp} onChange={setOtp} length={6} editable={!isLoading} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, (isLoading || otp.length !== 6) && styles.buttonDisabled]}
        disabled={isLoading || otp.length !== 6}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>{isLoading ? "Verifying..." : "Verify"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FCFCFC", alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12, color: "#333", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 40, lineHeight: 22, paddingHorizontal: 10 },
  button: { width: "100%", height: 50, backgroundColor: "#2A4E62", borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 24 },
  buttonDisabled: { backgroundColor: "#B0B0B0" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  error: { color: "#FF3B30", marginTop: 12, textAlign: "center" }
});