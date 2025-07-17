import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";
import { useSession } from "../contexts/SessionContext";
import { showError } from "../utils/showMessage";

export const useLogout = () => {
  const { logout } = useSession();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.replace("/LoginScreen");
    } catch (error) {
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
