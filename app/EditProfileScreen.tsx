import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, LabeledInput, Input } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { useFadeIn, useSlideIn, useEditProfile, useImagePicker } from "@/hooks";

export default function EditProfileScreen() {
  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });
  const { updateProfile, isLoading, currentUser } = useEditProfile();
  const { showImagePickerOptions, uploadImage, isUploading } = useImagePicker();

  // Form state
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    city: currentUser?.city || "",
    profession: currentUser?.profession || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [profileImage, setProfileImage] = useState<{
    uri: string;
    fileName?: string;
    imageUrl?: string;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // Check if there are changes
      const originalData = {
        firstName: currentUser?.firstName || "",
        lastName: currentUser?.lastName || "",
        phone: currentUser?.phone || "",
        address: currentUser?.address || "",
        city: currentUser?.city || "",
        profession: currentUser?.profession || "",
      };
      
      setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalData));
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImagePicker = async () => {
    const imageResult = await showImagePickerOptions();
    if (imageResult) {
      setProfileImage(imageResult);
      setHasChanges(true);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      Alert.alert("No Changes", "No changes were made to your profile.");
      return;
    }

    try {
      // Prepare update payload - only include changed fields
      const updatePayload: any = {};
      
      if (formData.firstName !== currentUser?.firstName) {
        updatePayload.firstName = formData.firstName;
      }
      
      if (formData.lastName !== currentUser?.lastName) {
        updatePayload.lastName = formData.lastName;
      }
      
      if (formData.phone !== (currentUser?.phone || "")) {
        updatePayload.phone = formData.phone;
      }
      
      if (formData.address !== (currentUser?.address || "")) {
        updatePayload.address = formData.address;
      }

      if (formData.city !== (currentUser?.city || "")) {
        updatePayload.city = formData.city;
      }

      if (formData.profession !== (currentUser?.profession || "")) {
        updatePayload.profession = formData.profession;
      }

      // Handle image upload if a new image was selected
      if (profileImage && !profileImage.imageUrl && profileImage.fileName) {
        const imageToUpload = {
          uri: profileImage.uri,
          fileName: profileImage.fileName,
        };
        const uploadedImage = await uploadImage(imageToUpload);
        
        if (uploadedImage && uploadedImage.imageUrl) {
          updatePayload.memberImage = {
            fileName: uploadedImage.fileName,
            imageUrl: uploadedImage.imageUrl,
          };
        }
      } else if (profileImage && profileImage.imageUrl && profileImage.fileName) {
        // Image already uploaded
        updatePayload.memberImage = {
          fileName: profileImage.fileName,
          imageUrl: profileImage.imageUrl,
        };
      }

      const result = await updateProfile(updatePayload);
      
      if (result.success) {
        // Navigate back to profile screen
        router.back();
      }
    } catch (error) {
      console.error('Save profile error:', error);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        "Discard Changes",
        "Are you sure you want to discard your changes?",
        [
          { text: "Keep Editing", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
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
            {/* Profile Avatar Section */}
            <View style={styles.avatarSection}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={handleImagePicker}
                disabled={isLoading || isUploading}
              >
                {profileImage ? (
                  <Image source={{ uri: profileImage.uri }} style={styles.avatarImage} />
                ) : currentUser?.imageUrl ? (
                  <Image source={{ uri: currentUser.imageUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>
                    {(formData.firstName.charAt(0) + formData.lastName.charAt(0)).toUpperCase()}
                  </Text>
                )}
                <View style={styles.avatarOverlay}>
                  {isUploading ? (
                    <Text style={styles.uploadingText}>...</Text>
                  ) : (
                    <Ionicons name="camera" size={20} color={Colors.white} />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarLabel}>
                {isUploading ? "Uploading..." : "Tap to change photo"}
              </Text>
            </View>

            {/* Personal Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>
              
              <View style={styles.formRow}>
                <View style={styles.halfWidth}>
                  <LabeledInput
                    label="First Name"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChangeText={(value: string) => handleInputChange("firstName", value)}
                    error={errors.firstName}
                    editable={!isLoading}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <LabeledInput
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChangeText={(value: string) => handleInputChange("lastName", value)}
                    error={errors.lastName}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <LabeledInput
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value: string) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
                editable={!isLoading}
              />

              <LabeledInput
                label="Profession"
                placeholder="Enter your profession"
                value={formData.profession}
                onChangeText={(value: string) => handleInputChange("profession", value)}
                editable={!isLoading}
              />
            </View>

            {/* Location Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location-outline" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Location Information</Text>
              </View>

              <LabeledInput
                label="City"
                placeholder="Enter your city"
                value={formData.city}
                onChangeText={(value: string) => handleInputChange("city", value)}
                editable={!isLoading}
              />

              <LabeledInput
                label="Address"
                placeholder="Enter your address"
                value={formData.address}
                onChangeText={(value: string) => handleInputChange("address", value)}
                multiline
                numberOfLines={3}
                editable={!isLoading}
              />
            </View>

            {/* Account Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-outline" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Account Information</Text>
              </View>
              
              <LabeledInput
                label="Email"
                value={currentUser?.email || ""}
                editable={false}
                style={styles.readOnlyInput}
              />
              <Text style={styles.readOnlyNote}>
                📧 Email cannot be changed. Contact support if you need to update your email address.
              </Text>
            </View>

            {/* Changes Indicator */}
            {hasChanges && (
              <View style={styles.changesIndicator}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.changesText}>You have unsaved changes</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Bottom Save Button */}
      <View style={styles.bottomButtonContainer}>
        <Button
          title={hasChanges ? "Save Changes" : "No Changes"}
          onPress={handleSaveProfile}
          loading={isLoading || isUploading}
          disabled={!hasChanges || isUploading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerButton: {
    minWidth: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: Colors.gray100,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.white,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
  },
  uploadingText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: "bold",
  },
  avatarLabel: {
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 8,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  readOnlyInput: {
    backgroundColor: Colors.gray200,
    opacity: 0.7,
  },
  readOnlyNote: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 8,
    marginLeft: 4,
    fontStyle: "italic",
    lineHeight: 16,
  },
  changesIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success + "20",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 20,
  },
  changesText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.success,
    fontWeight: "500",
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    backgroundColor: Colors.white,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButton: {
    marginTop: 0,
    borderRadius: 12,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.gray300,
    opacity: 0.6,
  },
});
