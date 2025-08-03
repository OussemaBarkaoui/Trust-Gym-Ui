import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input } from "./input";
import { Colors } from "@/constants/Colors";

interface LabeledInputProps {
  label: string;
  error?: string;
  [key: string]: any; // Allow all other props to be passed through
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Input
        style={[styles.input, style]}
        error={error}
        showError={!!error}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    // Add any additional styling if needed
  },
});
