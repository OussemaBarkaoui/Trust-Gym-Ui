import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";
import { useSession } from "../contexts/SessionContext";

export const useLogout = () => {
  const { logout } = useSession();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.replace("/LoginScreen");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  }, [logout, router]);

  const confirmLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: handleLogout,
      },
    ]);
  }, [handleLogout]);

  return {
    handleLogout,
    confirmLogout,
  };
};
