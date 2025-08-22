import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/SessionContext";
import { Access } from "@/entities/Access";
import { useAccessHistory, useFadeIn, useSlideIn } from "@/hooks";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function AccessScreen() {
  const { accessHistory, loading, totalItems, refreshAccessHistory } =
    useAccessHistory();
  const { session } = useSession();
  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });

  // Get cardId from the most recent access or generate a default one
  const getCardId = (): string => {
    if (accessHistory.length > 0) {
      // Use the cardId from the most recent access
      return accessHistory[0].cardId;
    }
    // If no access history, generate a default cardId based on user ID
    // In a real app, this should come from the member profile
    return session.user?.id
      ? `CARD-${session.user.id.slice(-8).toUpperCase()}`
      : "CARD-DEFAULT";
  };

  const cardId = getCardId();

  const showQRCodeInfo = () => {
    Alert.alert(
      "QR Code Access",
      "Show this QR code to the gym scanner to gain access. Your card ID is: " +
        cardId,
      [{ text: "OK" }]
    );
  };

  const formatDate = (dateValue: Date | string) => {
    try {
      let date: Date;

      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === "string") {
        if (dateValue.includes(" ")) {
          // If it's a dateTime format like "2025-08-15 07:00:00"
          date = new Date(dateValue);
        } else {
          // If it's just a date like "2025-08-15"
          date = new Date(dateValue + "T00:00:00");
        }
      } else {
        return "Invalid Date";
      }

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
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
        // If timeString is like "07:00", create a date with today and that time
        const today = new Date().toISOString().split("T")[0];
        date = new Date(`${today}T${timeString}:00`);
      } else {
        return timeString; // Return as is if can't parse
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

  const handleAccessPress = (accessItem: Access) => {
    router.push(`/AccessDetailsScreen?id=${accessItem.id}`);
  };

  const renderAccessItem = ({ item }: { item: Access }) => {
    // Debug logging for date issues
    console.log("Access item data:", {
      id: item.id,
      date: item.date,
      time: item.time,
      dateTime: item.dateTime,
      accessType: item.accessType,
    });

    return (
      <TouchableOpacity
        style={styles.accessItem}
        onPress={() => handleAccessPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.accessHeader}>
          <View style={styles.accessInfo}>
            <View style={styles.accessTypeContainer}>
              <View
                style={[
                  styles.accessTypeIcon,
                  {
                    backgroundColor:
                      item.accessType === "ENTRY"
                        ? Colors.success + "20"
                        : Colors.error + "20",
                  },
                ]}
              >
                <Ionicons
                  name={item.accessType === "ENTRY" ? "enter" : "exit"}
                  size={16}
                  color={
                    item.accessType === "ENTRY" ? Colors.success : Colors.error
                  }
                />
              </View>
              <View>
                <Text style={styles.accessType}>{item.accessType}</Text>
                <Text style={styles.accessDate}>
                  {formatDate(item.dateTime || item.date)}
                </Text>
              </View>
            </View>
            <Text style={styles.accessTime}>
              {formatTime(item.time, item.dateTime)}
            </Text>
          </View>
        </View>

        <View style={styles.accessDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="card-outline" size={14} color={Colors.textSubtle} />
            <Text style={styles.detailText} numberOfLines={1}>
              Card: {item.cardId}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name={item.isAuthorized ? "checkmark-circle" : "close-circle"}
              size={14}
              color={item.isAuthorized ? Colors.success : Colors.error}
            />
            <Text style={styles.detailText}>
              {item.isAuthorized ? "Authorized" : "Unauthorized"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="time-outline" size={64} color={Colors.textSubtle} />
      <Text style={styles.emptyTitle}>No Access History</Text>
      <Text style={styles.emptyDescription}>
        Your gym access history will appear here when you start visiting the
        gym.
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading access history...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Access History</Text>
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
          {loading ? (
            renderLoadingState()
          ) : (
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={refreshAccessHistory}
                  colors={[Colors.primary]}
                  tintColor={Colors.primary}
                />
              }
            >
              {/* QR Code Access Card */}
              <View style={styles.qrContainer}>
                <View style={styles.qrCard}>
                  <View style={styles.qrHeader}>
                    <Ionicons name="qr-code" size={24} color={Colors.primary} />
                    <Text style={styles.qrTitle}>Access QR Code</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.qrCodeContainer}
                    onPress={showQRCodeInfo}
                    activeOpacity={0.8}
                  >
                    <QRCode
                      value={cardId}
                      size={120}
                      color={Colors.text}
                      backgroundColor={Colors.white}
                    />
                  </TouchableOpacity>

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardLabel}>Card ID</Text>
                    <Text style={styles.cardValue}>{cardId}</Text>
                    <Text style={styles.cardInstructions}>
                      Show this QR code to access the gym
                    </Text>
                  </View>
                </View>
              </View>

              {/* Access History Section */}
              <View style={styles.historySection}>
                {accessHistory.length === 0
                  ? renderEmptyState()
                  : accessHistory.map((item) => (
                      <View key={item.id}>{renderAccessItem({ item })}</View>
                    ))}
              </View>
            </ScrollView>
          )}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingTop: 20,
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
    paddingBottom: 20,
  },
  // QR Code Styles
  qrContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  qrCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
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
  qrHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  qrCodeContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray200,
    marginBottom: 16,
  },
  cardInfo: {
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 12,
    color: Colors.textSubtle,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
    fontFamily: "monospace",
  },
  cardInstructions: {
    fontSize: 12,
    color: Colors.textSubtle,
    textAlign: "center",
  },
  // History Section Styles
  historySection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  summaryContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
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
  summaryTitle: {
    fontSize: 14,
    color: Colors.textSubtle,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  accessItem: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accessHeader: {
    marginBottom: 12,
  },
  accessInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accessTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accessTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accessType: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  accessDate: {
    fontSize: 12,
    color: Colors.textSubtle,
  },
  accessTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  accessDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSubtle,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSubtle,
    textAlign: "center",
    lineHeight: 20,
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
});
