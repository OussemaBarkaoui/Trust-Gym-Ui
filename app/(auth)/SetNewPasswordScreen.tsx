import { useResetPasswordForm } from "@/hooks/useResetPasswordForm";
import { Input } from "@/components/ui/input";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
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

export default function SetNewPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const otp = Array.isArray(params.otp) ? params.otp[0] : params.otp;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logoScale = useRef(new Animated.Value(0)).current;

  const { error, resetPassword } = useResetPasswordForm();

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  // Prevent back navigation on Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent default back behavior
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription?.remove();
    }, [])
  );

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPwd: string, originalPwd: string) => {
    if (!confirmPwd) {
      return "Please confirm your password";
    }
    if (confirmPwd !== originalPwd) {
      return "Passwords do not match";
    }
    return "";
  };

  const handlePasswordChange = (text: string) => {
    setNewPassword(text);
    if (passwordTouched) {
      setPasswordError(validatePassword(text));
    }
    
    if (confirmPasswordTouched) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, text));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordTouched) {
      setConfirmPasswordError(validateConfirmPassword(text, newPassword));
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(newPassword));
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
    setConfirmPasswordError(validateConfirmPassword(confirmPassword, newPassword));
  };

  const handleSubmit = async () => {
   
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, newPassword);
    
    setPasswordError(newPasswordError);
    setConfirmPasswordError(confirmPasswordError);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (newPasswordError || confirmPasswordError) {
      return;
    }

    setIsLoading(true);
    try {
      console.log(
        "Resetting password for email:",
        email,
        "with OTP:",
        otp,
        "and new password",
        newPassword
      );
      await resetPassword(email, otp, newPassword);
      Alert.alert("Success", "Your password has been reset. Please log in.", [
        { text: "OK", onPress: () => router.replace("/LoginScreen") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = newPassword && confirmPassword && !passwordError && !confirmPasswordError;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Set New Password</Text>
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

          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>Enter your new password below.</Text>
          
           <Input
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={handlePasswordChange}
            onBlur={handlePasswordBlur}
            error={passwordError}
            showError={passwordTouched}
            editable={!isLoading}
            returnKeyType="next"
            showPasswordToggle={true} 
          />

          <Input
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            error={confirmPasswordError}
            showError={confirmPasswordTouched}
            editable={!isLoading}
            returnKeyType="done"
            showPasswordToggle={false} 
          />

          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || !isFormValid) && styles.buttonDisabled,
            ]}
            disabled={isLoading || !isFormValid}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Text>
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
    justifyContent: "center",
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
});