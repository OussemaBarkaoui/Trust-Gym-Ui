import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/ui/Button";
import { Colors } from "../constants/Colors";
import { useChangePassword, useFadeIn, useSlideIn } from "../hooks";

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { changePassword, isLoading } = useChangePassword();
  const fadeAnim = useFadeIn({ duration: 600, delay: 100 });
  const slideAnim = useSlideIn({ duration: 500, delay: 50 });

  const handleChangePassword = async () => {
    // Validation
    if (!oldPassword.trim()) {
      Alert.alert("Error", "Please enter your current password");
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      Alert.alert(
        "Error",
        "New password must be different from current password"
      );
      return;
    }

    const result = await changePassword({
      oldPassword,
      newPassword,
    });

    if (result.success) {
      // Reset form and navigate back
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back();
    }
  };

  const getPasswordStrength = () => {
    if (newPassword.length === 0) return 0;
    if (newPassword.length < 6) return 25;
    if (newPassword.length < 8) return 50;
    return 100;
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 50) return Colors.error;
    if (strength < 100) return Colors.warning;
    return Colors.success;
  };

  const getStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength === 0) return "";
    if (strength < 50) return "Weak";
    if (strength < 100) return "Medium";
    return "Strong";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Icon and Description */}
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons name="key" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.description}>
              Keep your account secure by updating your password regularly
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Ionicons name="lock-closed" size={16} color={Colors.primary} />{" "}
                Current Password
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Enter your current password"
                  secureTextEntry={!showOldPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  placeholderTextColor={Colors.textSubtle}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowOldPassword(!showOldPassword)}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showOldPassword ? "eye-off" : "eye"}
                    size={20}
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Ionicons name="key" size={16} color={Colors.primary} /> New
                Password
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter your new password"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  placeholderTextColor={Colors.textSubtle}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={20}
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <Text style={styles.strengthTitle}>Password Strength</Text>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthFill,
                      {
                        width: `${getPasswordStrength()}%`,
                        backgroundColor: getStrengthColor(),
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[styles.strengthText, { color: getStrengthColor() }]}
                >
                  {getStrengthText()}
                </Text>
              </View>
            )}

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={Colors.primary}
                />{" "}
                Confirm New Password
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your new password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  placeholderTextColor={Colors.textSubtle}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>
                <Ionicons
                  name="information-circle"
                  size={16}
                  color={Colors.primary}
                />{" "}
                Password Requirements
              </Text>
              <View style={styles.requirementsList}>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={
                      newPassword.length >= 6
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      newPassword.length >= 6
                        ? Colors.success
                        : Colors.textSubtle
                    }
                  />
                  <Text
                    style={[
                      styles.requirement,
                      newPassword.length >= 6 && styles.requirementMet,
                    ]}
                  >
                    At least 6 characters long
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={
                      oldPassword && newPassword && oldPassword !== newPassword
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      oldPassword && newPassword && oldPassword !== newPassword
                        ? Colors.success
                        : Colors.textSubtle
                    }
                  />
                  <Text
                    style={[
                      styles.requirement,
                      oldPassword &&
                        newPassword &&
                        oldPassword !== newPassword &&
                        styles.requirementMet,
                    ]}
                  >
                    Different from current password
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={
                      newPassword &&
                      confirmPassword &&
                      newPassword === confirmPassword
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      newPassword &&
                      confirmPassword &&
                      newPassword === confirmPassword
                        ? Colors.success
                        : Colors.textSubtle
                    }
                  />
                  <Text
                    style={[
                      styles.requirement,
                      newPassword &&
                        confirmPassword &&
                        newPassword === confirmPassword &&
                        styles.requirementMet,
                    ]}
                  >
                    Passwords match
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Button at Bottom */}
        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? "Changing Password..." : "Change Password"}
            onPress={handleChangePassword}
            disabled={
              isLoading || !oldPassword || !newPassword || !confirmPassword
            }
            style={styles.changeButton}
          />
        </View>
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
    paddingBottom: 100,
  },
  iconContainer: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSubtle,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderRadius: 16,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 20,
    fontSize: 16,
    color: Colors.text,
  },
  eyeButton: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  strengthContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  strengthBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  strengthFill: {
    height: "100%",
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
  },
  requirementsContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirement: {
    fontSize: 14,
    color: Colors.textSubtle,
    marginLeft: 12,
    flex: 1,
  },
  requirementMet: {
    color: Colors.success,
    fontWeight: "500",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  changeButton: {
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
