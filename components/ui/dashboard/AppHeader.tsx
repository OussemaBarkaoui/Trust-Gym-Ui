import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { useSession } from "../../../contexts/SessionContext";
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
  notificationCount = 3,
}: AppHeaderProps) {
  const headerAnim = useRef(new Animated.Value(-50)).current;
  const { session } = useSession();
  const { confirmLogout } = useLogout();

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

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
            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.7}
              onPress={confirmLogout}
            >
              <View style={styles.profileIcon}>
                <Text style={styles.profileText}>👤</Text>
              </View>
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
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
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  profileText: {
    fontSize: 20,
    color: Colors.gray600,
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
