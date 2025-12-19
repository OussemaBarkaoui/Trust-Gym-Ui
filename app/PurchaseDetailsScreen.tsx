import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { Colors } from "../constants/Colors";
import {
  MemberPurchase,
  getMemberPurchaseById,
} from "../features/purchases/api";
import { useFadeIn, useProductImage, useSlideIn } from "../hooks";
import { showError } from "../utils/showMessage";
import { createShadow } from "@/utils/platformStyles";

export default function PurchaseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [purchase, setPurchase] = useState<MemberPurchase | null>(null);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });

  // Product image hook
  const {
    image: productImage,
    loading: imageLoading,
    error: imageError,
  } = useProductImage(purchase?.product?.id);

  useEffect(() => {
    if (id) {
      fetchPurchaseDetails();
    }
  }, [id]);

  const fetchPurchaseDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching purchase details for ID:", id);
      const purchaseData = await getMemberPurchaseById(id!);
      console.log("Purchase data received:", purchaseData);
      setPurchase(purchaseData);
    } catch (error: any) {
      console.error("Failed to fetch purchase details:", error);
      console.error("Error details:", error.message, error.status);
      showError(error.message || "Failed to load purchase details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: string) => {
    return `${parseFloat(amount).toFixed(2)}DT`;
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
          <Text style={styles.headerTitle}>Purchase Details</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading purchase details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!purchase) {
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
          <Text style={styles.headerTitle}>Purchase Details</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Purchase not found</Text>
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
        <Text style={styles.headerTitle}>Purchase Details</Text>
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
                    backgroundColor: purchase.isPaid
                      ? Colors.success
                      : Colors.warning,
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {purchase.isPaid ? "Paid" : "Pending Payment"}
              </Text>
            </View>
            <Text style={styles.purchaseId}>Purchase ID: {purchase.id}</Text>
          </View>

          {/* Product Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="cube" size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Product Details</Text>
            </View>
            <View style={styles.cardContent}>
              {/* Product Image */}
              <View style={styles.productImageContainer}>
                {imageLoading ? (
                  <View style={styles.imageLoadingContainer}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.imageLoadingText}>
                      Loading image...
                    </Text>
                  </View>
                ) : productImage ? (
                  <Image
                    source={{ uri: productImage.imageUrl }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.noImageContainer}>
                    <Ionicons
                      name="image-outline"
                      size={32}
                      color={Colors.textSubtle}
                    />
                    <Text style={styles.noImageText}>No image available</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Product Name</Text>
                <Text style={styles.detailValue}>{purchase.product.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Unit Price</Text>
                <Text style={styles.detailValue}>
                  {formatAmount(purchase.product.unitPrice.toString())}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantity</Text>
                <Text style={styles.detailValue}>{purchase.quantity}</Text>
              </View>
              <View style={[styles.detailRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>
                  {formatAmount(purchase.total)}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="card" size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Payment Information</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <Text style={styles.detailValue}>{purchase.paymentMethod}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Status</Text>
                <View style={styles.paymentStatusContainer}>
                  <View
                    style={[
                      styles.paymentStatusIndicator,
                      {
                        backgroundColor: purchase.isPaid
                          ? Colors.success
                          : Colors.warning,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.paymentStatusText,
                      {
                        color: purchase.isPaid
                          ? Colors.success
                          : Colors.warning,
                      },
                    ]}
                  >
                    {purchase.isPaid ? "Paid" : "Pending"}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Purchase Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(purchase.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Gym Information */}
          {purchase.gym && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="location" size={24} color={Colors.primary} />
                <Text style={styles.cardTitle}>Gym Location</Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{purchase.gym.location}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Member Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Member Information</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>
                  {purchase.member.firstName.charAt(0).toUpperCase() + purchase.member.firstName.slice(1)} {purchase.member.lastName.charAt(0).toUpperCase() + purchase.member.lastName.slice(1)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{purchase.member.email}</Text>
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
  purchaseId: {
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
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSubtle,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    flex: 1,
    textAlign: "right",
    flexWrap: "wrap",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: 16,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    flex: 1,
    textAlign: "right",
  },
  paymentStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  paymentStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  paymentStatusText: {
    fontSize: 16,
    fontWeight: "500",
  },
  // Product Image Styles
  productImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.gray100,
  },
  imageLoadingContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  imageLoadingText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textSubtle,
  },
  noImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textSubtle,
    textAlign: "center",
  },
});
