import { forgotPassword } from "@/features/(auth)/api";
import { useOtpVerificationForm } from "@/hooks/useOtpVerificationForm";
import { showError, showSuccess } from "@/utils/showMessage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import appLogo from "../../assets/images/appLogoNobg.png";
import { OtpInput } from "../../components/ui";

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const logoScale = useRef(new Animated.Value(0)).current;

  const { error, verifyOtp } = useOtpVerificationForm();
  const hasSubmitted = useRef(false);

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBackPress = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (isLoading || otp.length !== 6 || hasSubmitted.current) return;
    hasSubmitted.current = true;
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      router.push({
        pathname: "/SetNewPasswordScreen",
        params: { email, otp },
      });
    } catch (err: any) {
      showError(err?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        hasSubmitted.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    if (otp.length === 6 && !isLoading) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleResendOtp = async () => {
    if (isResending || isLoading) return;

    setIsResending(true);
    try {
      await forgotPassword(email);
      showSuccess("A new OTP has been sent to your email address.");
      setOtp(""); // Clear current OTP
    } catch (error) {
      showError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OTP Verification</Text>
        <View style={styles.headerRight} />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.Image
            style={[styles.image, { transform: [{ scale: logoScale }] }]}
            source={appLogo}
          />

          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            Check your email for a 6-digit code.
          </Text>

          <View style={styles.inputContainer}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              length={6}
              editable={!isLoading}
            />
            <Text style={styles.instructionText}>
              We've sent password reset instructions to {email}. Please check
              your email and follow the instructions to reset your password.
            </Text>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
              disabled={isResending || isLoading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.resendButtonText,
                  (isResending || isLoading) && styles.resendButtonTextDisabled,
                ]}
              >
                {isResending ? "Resending..." : "Didn't receive OTP? Resend"}
              </Text>
            </TouchableOpacity>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || otp.length !== 6) && styles.buttonDisabled,
            ]}
            disabled={isLoading || otp.length !== 6}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.buttonText}>Verifying...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 8 : 12,
    backgroundColor: "#FCFCFC",
    borderBottomWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0,
    borderBottomColor: "#E0E0E0",
    minHeight: Platform.OS === "ios" ? 44 : 56,
    marginTop: Platform.OS === "ios" ? -50 : 0,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
    marginLeft: 60,
  },
  headerRight: {
    minWidth: 60,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  image: {
    height: 150,
    width: 200,
    marginBottom: 30,
    resizeMode: "contain",
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
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#2A4E62",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#B0B0B0",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  resendButtonText: {
    fontSize: 14,
    color: "#2A4E62",
    textAlign: "center",
    fontWeight: "500",
  },
  resendButtonTextDisabled: {
    color: "#B0B0B0",
  },
});
