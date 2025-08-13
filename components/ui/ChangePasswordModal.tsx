import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useChangePassword } from "../../hooks";
import { Button } from "./Button";
import { Input } from "./input";

const { height: screenHeight } = Dimensions.get('window');

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ visible, onClose }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { changePassword, isLoading } = useChangePassword();

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
      Alert.alert("Error", "New password must be different from current password");
      return;
    }

    const result = await changePassword({
      oldPassword,
      newPassword
    });
    
    if (result.success) {
      // Reset form and close modal
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                {/* Header with gradient effect */}
                <View style={styles.headerGradient}>
                  <View style={styles.header}>
                    <View style={styles.headerContent}>
                      <View style={styles.iconContainer}>
                        <Ionicons name="key" size={28} color={Colors.primary} />
                      </View>
                      <View style={styles.titleContainer}>
                        <Text style={styles.title}>Change Password</Text>
                        <Text style={styles.subtitle}>Keep your account secure</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={styles.closeButton}
                      disabled={isLoading}
                    >
                      <Ionicons name="close" size={24} color={Colors.textSubtle} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Scrollable Form Content */}
                <ScrollView 
                  style={styles.scrollContainer}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.form}>
                    {/* Current Password */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>
                        <Ionicons name="lock-closed" size={16} color={Colors.primary} />
                        {" "}Current Password
                      </Text>
                      <View style={styles.inputWrapper}>
                        <Input
                          value={oldPassword}
                          onChangeText={setOldPassword}
                          placeholder="Enter your current password"
                          secureTextEntry={true}
                          showPasswordToggle={true}
                          editable={!isLoading}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    </View>

                    {/* New Password */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>
                        <Ionicons name="key" size={16} color={Colors.primary} />
                        {" "}New Password
                      </Text>
                      <View style={styles.inputWrapper}>
                        <Input
                          value={newPassword}
                          onChangeText={setNewPassword}
                          placeholder="Enter your new password"
                          secureTextEntry={true}
                          showPasswordToggle={true}
                          editable={!isLoading}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    </View>

                    {/* Confirm New Password */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                        {" "}Confirm New Password
                      </Text>
                      <View style={styles.inputWrapper}>
                        <Input
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          placeholder="Confirm your new password"
                          secureTextEntry={true}
                          showPasswordToggle={true}
                          editable={!isLoading}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
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
                                width: `${Math.min((newPassword.length / 8) * 100, 100)}%`,
                                backgroundColor: newPassword.length < 6 ? Colors.error : 
                                                newPassword.length < 8 ? '#FFA500' : Colors.success
                              }
                            ]} 
                          />
                        </View>
                      </View>
                    )}

                    {/* Enhanced Password Requirements */}
                    <View style={styles.requirementsContainer}>
                      <Text style={styles.requirementsTitle}>
                        <Ionicons name="information-circle" size={16} color={Colors.primary} />
                        {" "}Password Requirements
                      </Text>
                      <View style={styles.requirementsList}>
                        <View style={styles.requirementItem}>
                          <Ionicons 
                            name={newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                            size={16} 
                            color={newPassword.length >= 6 ? Colors.success : Colors.textSubtle} 
                          />
                          <Text style={[
                            styles.requirement,
                            newPassword.length >= 6 && styles.requirementMet
                          ]}>
                            At least 6 characters long
                          </Text>
                        </View>
                        <View style={styles.requirementItem}>
                          <Ionicons 
                            name={oldPassword && newPassword && oldPassword !== newPassword ? "checkmark-circle" : "ellipse-outline"} 
                            size={16} 
                            color={oldPassword && newPassword && oldPassword !== newPassword ? Colors.success : Colors.textSubtle} 
                          />
                          <Text style={[
                            styles.requirement,
                            oldPassword && newPassword && oldPassword !== newPassword && styles.requirementMet
                          ]}>
                            Different from current password
                          </Text>
                        </View>
                        <View style={styles.requirementItem}>
                          <Ionicons 
                            name={newPassword && confirmPassword && newPassword === confirmPassword ? "checkmark-circle" : "ellipse-outline"} 
                            size={16} 
                            color={newPassword && confirmPassword && newPassword === confirmPassword ? Colors.success : Colors.textSubtle} 
                          />
                          <Text style={[
                            styles.requirement,
                            newPassword && confirmPassword && newPassword === confirmPassword && styles.requirementMet
                          ]}>
                            Passwords match
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                {/* Fixed Actions Footer */}
                <View style={styles.actionsFooter}>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.cancelButton, isLoading && styles.disabledButton]}
                      onPress={handleClose}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <Button
                      title={isLoading ? "Changing..." : "Change Password"}
                      onPress={handleChangePassword}
                      disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
                      style={styles.changeButton}
                    />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: screenHeight * 0.9,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  headerGradient: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSubtle,
    lineHeight: 18,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  form: {
    padding: 24,
    paddingTop: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    // This wrapper ensures the Input component displays properly
  },
  passwordInput: {
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderRadius: 16,
    fontSize: 16,
    backgroundColor: Colors.white,
    marginBottom: 0, // Override the Input component's default margin
  },
  strengthContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.gray100,
    borderRadius: 16,
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
  },
  strengthFill: {
    height: "100%",
    borderRadius: 3,
  },
  requirementsContainer: {
    backgroundColor: Colors.gray100,
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
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
    marginBottom: 8,
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
  actionsFooter: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    padding: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  changeButton: {
    flex: 1,
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
  disabledButton: {
    opacity: 0.6,
  },
});
