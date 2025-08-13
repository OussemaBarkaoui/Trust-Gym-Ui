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
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useChangePassword } from "../../hooks";
import { Button } from "./Button";

const { height: screenHeight } = Dimensions.get('window');

interface ChangePasswordModalSimpleProps {
  visible: boolean;
  onClose: () => void;
}

export function ChangePasswordModalSimple({ visible, onClose }: ChangePasswordModalSimpleProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Change Password</Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={Colors.textSubtle} />
                  </TouchableOpacity>
                </View>

                {/* Form */}
                <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.form}>
                  {/* Current Password */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Current Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.input}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        placeholder="Enter your current password"
                        secureTextEntry={!showOldPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowOldPassword(!showOldPassword)}
                      >
                        <Ionicons
                          name={showOldPassword ? "eye-off" : "eye"}
                          size={20}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* New Password */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter your new password"
                        secureTextEntry={!showNewPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Ionicons
                          name={showNewPassword ? "eye-off" : "eye"}
                          size={20}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirm Password */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm your new password"
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={20}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Requirements */}
                  <View style={styles.requirementsContainer}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <Text style={styles.requirement}>• At least 6 characters long</Text>
                    <Text style={styles.requirement}>• Different from current password</Text>
                    <Text style={styles.requirement}>• Passwords must match</Text>
                  </View>
                </ScrollView>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.cancelButton, isLoading && styles.disabledButton]}
                    onPress={handleClose}
                    disabled={isLoading}
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
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: screenHeight * 0.8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
  },
  scrollContainer: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
  },
  eyeButton: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  requirementsContainer: {
    backgroundColor: Colors.gray100,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    color: Colors.textSubtle,
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray200,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  changeButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
