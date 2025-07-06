import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Logo } from "../../components/ui/Logo";
import { useResetPasswordForm } from "@/hooks/useResetPasswordForm";

export default function SetNewPasswordScreen() {
  const router = useRouter();
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { error, resetPassword } = useResetPasswordForm();

  const handleSubmit = async () => {
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      Alert.alert("Success", "Your password has been reset. Please log in.", [
        { text: "OK", onPress: () => router.replace("/(auth)/LoginScreen") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Logo />
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>Enter your new password below.</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        editable={!isLoading}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[
          styles.button,
          (isLoading || !newPassword) && styles.buttonDisabled,
        ]}
        disabled={isLoading || !newPassword}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    marginBottom: 18,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#2A4E62",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: { backgroundColor: "#B0B0B0" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  error: { color: "#FF3B30", marginTop: 12, textAlign: "center" },
});
