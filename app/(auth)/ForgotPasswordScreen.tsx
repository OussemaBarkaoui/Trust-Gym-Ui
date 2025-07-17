import { forgotPassword } from "@/features/(auth)/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import appLogo from "../../assets/images/appLogoNobg.png";
import { showError } from "../../utils/showMessage";
import { forgotPasswordSchema } from "../../utils/validation";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  // Real-time email validation using Yup
  const handleEmailChange = async (text: string) => {
    setEmail(text);
    if (touched) {
      try {
        await forgotPasswordSchema.validate({ email: text });
        setEmailError("");
      } catch (err: any) {
        setEmailError(err.message);
      }
    }
  };

  // Handle input blur (when user leaves the field)
  const handleEmailBlur = async () => {
    setTouched(true);
    try {
      await forgotPasswordSchema.validate({ email });
      setEmailError("");
    } catch (err: any) {
      setEmailError(err.message);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleSendResetLink = async () => {
    // Validate email before sending
    try {
      await forgotPasswordSchema.validate({ email });
      setEmailError("");
    } catch (err: any) {
      setTouched(true);
      setEmailError(err.message);
      showError(err.message, "Invalid Email");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email);
      router.push({ pathname: "/OtpVerification", params: { email } });
    } catch (error) {
      showError(
        "Failed to send reset link. Please check your email address and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = !emailError && !!email;
  const isDisabled = !isFormValid || isLoading;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          disabled={isLoading}
        >
          {Platform.OS === "ios" ? (
            <View style={styles.iosBackButton}>
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
              <Text style={styles.iosBackText}>Login</Text>
            </View>
          ) : (
            <Ionicons name="arrow-back" size={24} color="#2A4E62" />
          )}
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Forgot Password</Text>

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

          <Text style={styles.title}>Forgot your password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send instructions to reset it.
          </Text>

          {/* Email Input with Validation */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                emailError && touched ? styles.inputError : null,
              ]}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              editable={!isLoading}
            />
            {emailError && touched && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{emailError}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            disabled={isDisabled}
            onPress={handleSendResetLink}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.buttonText}>Sending...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
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
  backButton: {
    padding: 4,
    minWidth: 60,
    alignItems: "flex-start",
  },
  iosBackButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  iosBackText: {
    color: "#007AFF",
    fontSize: 17,
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
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
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1.5,
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
});
