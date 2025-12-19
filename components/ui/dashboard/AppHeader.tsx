import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { createShadow } from "@/utils/platformStyles";
import { useSession } from "../../../contexts/SessionContext";
import { refreshUserProfileInSession } from "../../../features/profile/api";
import { useLogout } from "../../../hooks/useLogout";

interface AppHeaderProps {
  title: string;
  subtitle: string;
  showProfileButton?: boolean;
  notificationCount?: number;
}

export default function AppHeader({
  title,
  subtitle,
  showProfileButton = true,
  notificationCount = 0,
}: AppHeaderProps) {
  const headerAnim = useRef(new Animated.Value(-50)).current;
  const { session } = useSession();
  const { confirmLogout } = useLogout();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (session.user?.firstName && session.user?.lastName) {
      return `${session.user.firstName.charAt(0)}${session.user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    return "U";
  };

  const handleProfilePress = () => {
    if (showDropdown) {
      setShowDropdown(false);
    } else {
      router.push("/(tabs)/ProfileScreen");
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    confirmLogout();
  };

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Refresh profile data when AppHeader mounts (for image URL)
    const loadProfileData = async () => {
      if (session.isAuthenticated && session.user?.id) {
        await refreshUserProfileInSession();
      }
    };

    loadProfileData();
  }, [session.isAuthenticated, session.user?.id]);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          transform: [{ translateY: headerAnim }],
        },
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.brandContainer}>
            <Text style={styles.headerTitle}>
              <Text style={styles.trustText}>Trust</Text>
              <Text style={styles.gymText}>Gym</Text>
            </Text>
          </View>

          {showProfileButton && (
            <View style={styles.profileContainer}>
              <TouchableOpacity
                style={styles.profileButton}
                activeOpacity={0.7}
                onPress={handleProfilePress}
              >
                <View style={styles.profileAvatar}>
                  {session.user?.imageUrl ? (
                    <Image
                      source={{ uri: session.user.imageUrl }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.avatarText}>{getUserInitials()}</Text>
                  )}
                </View>
                {notificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Quick Actions */}
            </View>
          )}
        </View>

        <View style={styles.headerBottom}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{title}</Text>
            <Text style={styles.motivationalText}>{subtitle}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 50,
    paddingBottom: 20,
    ...createShadow("#000", { width: 0, height: 4 }, 0.08, 8, 8),
  },
  headerContent: {
    gap: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    textAlign: "left",
  },
  trustText: {
    color: Colors.info,
  },
  gymText: {
    color: Colors.black,
  },
  profileButton: {
    position: "relative",
    padding: 4,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
    ...createShadow(Colors.black, { width: 0, height: 2 }, 0.1, 4, 3),
    overflow: "hidden",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 22,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
  quickAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "600",
  },
  headerBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  greetingContainer: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  motivationalText: {
    fontSize: 14,
    color: Colors.textSubtle,
    fontStyle: "italic",
    letterSpacing: -0.1,
  },
});
