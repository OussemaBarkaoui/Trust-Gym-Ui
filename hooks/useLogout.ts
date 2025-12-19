import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, Platform } from "react-native";
import { useSession } from "../contexts/SessionContext";
import { showError } from "../utils/showMessage";

export const useLogout = () => {
  const { logout } = useSession();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      
      // Force navigation to login screen
      router.replace("/(auth)/LoginScreen");
      
      // On web, force a reload to ensure clean state
      if (Platform.OS === "web") {
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (error) {
      console.error("Logout error:", error);
      showError("Failed to logout. Please try again.");
    }
  }, [logout, router]);

  const confirmLogout = useCallback(() => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout? You will need to login again to access your account.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: handleLogout,
        },
      ],
      { cancelable: true }
    );
  }, [handleLogout]);

  return {
    handleLogout,
    confirmLogout,
  };
};
