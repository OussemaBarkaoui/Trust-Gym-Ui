import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "../../constants/Colors";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  size?: "small" | "medium" | "large";
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  disabled = false,
  style,
  labelStyle,
  size = "medium",
}) => {
  const checkboxSize = size === "small" ? 16 : size === "large" ? 24 : 20;
  const iconSize = size === "small" ? 12 : size === "large" ? 18 : 14;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: checkboxSize,
            height: checkboxSize,
            borderRadius: checkboxSize * 0.2,
          },
          checked && styles.checkedCheckbox,
          disabled && styles.disabledCheckbox,
        ]}
      >
        {checked && (
          <Text
            style={[
              styles.checkmark,
              {
                fontSize: iconSize,
                lineHeight: iconSize,
              },
              disabled && styles.disabledCheckmark,
            ]}
          >
            ✓
          </Text>
        )}
      </View>
      {label && (
        <Text
          style={[styles.label, labelStyle, disabled && styles.disabledLabel]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    borderWidth: 2,
    borderColor: Colors.gray300,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCheckbox: {
    backgroundColor: Colors.info,
    borderColor: Colors.info,
  },
  disabledCheckbox: {
    backgroundColor: Colors.gray100,
    borderColor: Colors.gray200,
  },
  checkmark: {
    color: Colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledCheckmark: {
    color: Colors.gray400,
  },
  label: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  disabledLabel: {
    color: Colors.textDisabled,
  },
});
