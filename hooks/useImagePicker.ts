import { uploadFile } from "@/features/profile/api";
import { showError, showSuccess } from "@/utils/showMessage";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Platform } from "react-native";

export interface ImagePickerResult {
  uri: string;
  fileName: string;
  imageUrl?: string;
}

export const useImagePicker = () => {
  const [isUploading, setIsUploading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload images!"
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async (): Promise<ImagePickerResult | null> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images" as any,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          fileName: asset.fileName || `profile_${Date.now()}.jpg`,
        };
      }
    } catch (error) {
      console.error("Image picker error:", error);
      showError("Failed to pick image");
    }

    return null;
  };

  const takePhoto = async (): Promise<ImagePickerResult | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take photos!"
      );
      return null;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          fileName: `photo_${Date.now()}.jpg`,
        };
      }
    } catch (error) {
      console.error("Camera error:", error);
      showError("Failed to take photo");
    }

    return null;
  };

  const uploadImage = async (
    imageData: ImagePickerResult
  ): Promise<ImagePickerResult | null> => {
    try {
      setIsUploading(true);

      console.log("🔍 Starting image upload:", {
        fileName: imageData.fileName,
        uri: imageData.uri.substring(0, 50) + "...",
      });

      const fileToUpload = {
        uri: imageData.uri,
        type: "image/jpeg",
        name: imageData.fileName,
      };

      console.log("🔍 File details before upload:", {
        fileName: imageData.fileName,
        uri: imageData.uri,
        type: "image/jpeg",
        uriLength: imageData.uri.length,
      });

      const uploadResult = await uploadFile(fileToUpload);

      console.log("✅ Upload result:", uploadResult);
      showSuccess("Image uploaded successfully!");

      return {
        uri: imageData.uri,
        fileName: uploadResult.fileName,
        imageUrl: uploadResult.fileUrl,
      };
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      showError(error.message || "Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const showImagePickerOptions = (): Promise<ImagePickerResult | null> => {
    return new Promise((resolve) => {
      Alert.alert(
        "Select Photo",
        "Choose how you want to select a photo",
        [
          {
            text: "Camera",
            onPress: async () => {
              const result = await takePhoto();
              resolve(result);
            },
          },
          {
            text: "Photo Library",
            onPress: async () => {
              const result = await pickImage();
              resolve(result);
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true }
      );
    });
  };

  return {
    pickImage,
    takePhoto,
    uploadImage,
    showImagePickerOptions,
    isUploading,
  };
};
