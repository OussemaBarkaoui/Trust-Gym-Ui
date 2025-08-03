import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppHeader, Button } from "../../components/ui";
import { Colors } from "../../constants/Colors";
import { useSession } from "../../contexts/SessionContext";
import { useFadeIn, useLogout, useSlideIn } from "../../hooks";
import { showSuccess } from "../../utils/showMessage";
import { refreshUserProfileInSession } from "../../features/profile/api";

export default function ProfileScreen() {
  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });
  const { session } = useSession();
  const { confirmLogout } = useLogout();

  // Refresh profile data when screen loads
  useEffect(() => {
    const loadProfileData = async () => {
      if (session.isAuthenticated && session.user?.id) {
        await refreshUserProfileInSession();
      }
    };
    
    loadProfileData();
  }, [session.isAuthenticated, session.user?.id]);

  const handleEditProfile = () => {
    router.push("/EditProfileScreen");
  };

  const handleChangePassword = () => {
    showSuccess("Change password functionality coming soon!");
  };

  const handleNotificationSettings = () => {
    showSuccess("Notification settings coming soon!");
  };

  const handlePrivacySettings = () => {
    showSuccess("Privacy settings coming soon!");
  };

  const handleHelpSupport = () => {
    showSuccess("Help & Support coming soon!");
  };

  const handleAbout = () => {
    Alert.alert(
      "About Trust Gym",
      "Trust Gym Mobile App\nVersion 1.0.0\n\nManage your gym membership and wallet with ease.",
      [{ text: "OK" }]
    );
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (session.user?.firstName && session.user?.lastName) {
      return `${session.user.firstName.charAt(0)}${session.user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    return "U";
  };

  const profileMenuItems = [
    {
      id: "edit-profile",
      title: "Edit Profile",
      icon: "person-outline",
      onPress: handleEditProfile,
    },
    {
      id: "change-password",
      title: "Change Password",
      icon: "key-outline",
      onPress: handleChangePassword,
    },
    {
      id: "notifications",
      title: "Notification Settings",
      icon: "notifications-outline",
      onPress: handleNotificationSettings,
    },
    {
      id: "privacy",
      title: "Privacy Settings",
      icon: "shield-outline",
      onPress: handlePrivacySettings,
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: handleHelpSupport,
    },
    {
      id: "about",
      title: "About",
      icon: "information-circle-outline",
      onPress: handleAbout,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <AppHeader
        title={`Hello, ${session.user?.firstName || "User"}!`}
        subtitle="Manage your profile and settings"
        showProfileButton={false}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {session.user?.imageUrl ? (
                <Image 
                  source={{ uri: session.user.imageUrl }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <Text style={styles.avatarText}>{getUserInitials()}</Text>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {session.user?.firstName} {session.user?.lastName}
              </Text>
              <Text style={styles.userEmail}>{session.user?.email}</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusIndicator} />
                <Text style={styles.statusText}>Active Member</Text>
              </View>
            </View>
          </View>

          {/* Profile Menu */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {profileMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.textSubtle}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <Button
              title="Logout"
              onPress={confirmLogout}
              style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.white,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textSubtle,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.success + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: "600",
  },
  menuSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  logoutSection: {
    marginTop: 20,
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: Colors.error,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
