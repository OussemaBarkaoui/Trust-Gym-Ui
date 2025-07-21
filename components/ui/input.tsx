import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  error?: string;
  showError?: boolean;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  prefix?: string;
}

export const Input: React.FC<InputProps> = ({
  error,
  showError,
  secureTextEntry,
  showPasswordToggle = true,
  prefix,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const hasError = showError && error;

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputContainer, hasError && styles.inputContainerError]}
      >
        {prefix && <Text style={styles.prefixText}>{prefix}</Text>}
        <TextInput
          style={[styles.input, prefix && styles.inputWithPrefix, style]}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        {secureTextEntry && showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {hasError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: "#FF3B30",
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  inputWithPrefix: {
    paddingLeft: 8,
  },
  prefixText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    paddingLeft: 16,
    paddingRight: 4,
  },
  eyeButton: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
});
