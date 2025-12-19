import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { Access } from "../entities/Access";
import { useAccessHistory, useFadeIn, useSlideIn } from "../hooks";
import { showError } from "../utils/showMessage";
import { createShadow } from "@/utils/platformStyles";

export default function AccessDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [accessDetails, setAccessDetails] = useState<Access | null>(null);
  const [loading, setLoading] = useState(true);
  const { accessHistory } = useAccessHistory();

  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });

  useEffect(() => {
    if (id && accessHistory.length > 0) {
      // Find the access details from the existing data
      const foundAccess = accessHistory.find((access) => access.id === id);
      if (foundAccess) {
        setAccessDetails(foundAccess);
      } else {
        showError("Access record not found");
        router.back();
      }
      setLoading(false);
    }
  }, [id, accessHistory]);

  const formatDate = (dateValue: Date | string) => {
    try {
      let date: Date;

      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === "string") {
        date = new Date(dateValue);
      } else {
        return "Invalid Date";
      }

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateValue);
      return "Invalid Date";
    }
  };

  const formatTime = (timeString: string, dateTimeValue?: Date | string) => {
    try {
      let date: Date;

      if (dateTimeValue instanceof Date) {
        date = dateTimeValue;
      } else if (typeof dateTimeValue === "string") {
        date = new Date(dateTimeValue);
      } else if (timeString.includes(":")) {
        const today = new Date().toISOString().split("T")[0];
        date = new Date(`${today}T${timeString}:00`);
      } else {
        return timeString;
      }

      if (isNaN(date.getTime())) {
        return timeString;
      }

      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error, timeString);
      return timeString;
    }
  };

  const formatDateTime = (dateTimeValue: Date | string) => {
    try {
      let date: Date;

      if (dateTimeValue instanceof Date) {
        date = dateTimeValue;
      } else {
        date = new Date(dateTimeValue);
      }

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting datetime:", error, dateTimeValue);
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Access Details</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading access details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!accessDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Access Details</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Access record not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Access Details</Text>
        <View style={styles.headerRight} />
      </View>

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
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      accessDetails.accessType === "ENTRY"
                        ? Colors.success
                        : Colors.error,
                  },
                ]}
              />
              <Text style={styles.statusText}>{accessDetails.accessType}</Text>
            </View>
            <Text style={styles.accessId}>Access ID: {accessDetails.id}</Text>
          </View>

          {/* Access Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="time" size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Access Information</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Access Type</Text>
                <View style={styles.accessTypeContainer}>
                  <Ionicons
                    name={
                      accessDetails.accessType === "ENTRY" ? "enter" : "exit"
                    }
                    size={16}
                    color={
                      accessDetails.accessType === "ENTRY"
                        ? Colors.success
                        : Colors.error
                    }
                  />
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color:
                          accessDetails.accessType === "ENTRY"
                            ? Colors.success
                            : Colors.error,
                      },
                    ]}
                  >
                    {accessDetails.accessType}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(accessDetails.date)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>
                  {formatTime(accessDetails.time, accessDetails.dateTime)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full DateTime</Text>
                <Text style={styles.detailValue}>
                  {formatDateTime(accessDetails.dateTime)}
                </Text>
              </View>
            </View>
          </View>

          {/* Authorization Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.cardTitle}>Authorization</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Authorization Status</Text>
                <View style={styles.authStatusContainer}>
                  <Ionicons
                    name={
                      accessDetails.isAuthorized
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={16}
                    color={
                      accessDetails.isAuthorized ? Colors.success : Colors.error
                    }
                  />
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color: accessDetails.isAuthorized
                          ? Colors.success
                          : Colors.error,
                      },
                    ]}
                  >
                    {accessDetails.isAuthorized ? "Authorized" : "Unauthorized"}
                  </Text>
                </View>
              </View>
            </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSubtle,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.error,
  },
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...createShadow(Colors.black, { width: 0, height: 2 }, 0.1, 8, 4),
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  accessId: {
    fontSize: 12,
    color: Colors.textSubtle,
    fontFamily: "monospace",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    ...createShadow(Colors.black, { width: 0, height: 2 }, 0.1, 8, 4),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 12,
  },
  cardContent: {
    padding: 20,
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSubtle,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    flex: 1,
    textAlign: "right",
  },
  accessTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  authStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
});
