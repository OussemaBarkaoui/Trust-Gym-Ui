import { Colors } from "@/constants/Colors";
import type { ButtonSize, ButtonVariant } from "@/types/common";
import React, { memo, useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const Button = memo<ButtonProps>(
  ({
    title,
    onPress,
    disabled = false,
    loading = false,
    variant = "primary",
    size = "large",
    style,
    textStyle,
    testID,
  }) => {
    const isDisabled = disabled || loading;

    const buttonStyle = useMemo(
      () => [
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ],
      [variant, size, isDisabled, style]
    );

    const buttonTextStyle = useMemo(
      () => [
        styles.baseText,
        styles[`${variant}Text` as keyof typeof styles],
        styles[`${size}Text` as keyof typeof styles],
        isDisabled && styles.disabledText,
        textStyle,
      ],
      [variant, size, isDisabled, textStyle]
    );

    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        testID={testID}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              variant === "primary"
                ? Colors.white
                : variant === "info"
                ? Colors.white
                : variant === "black"
                ? Colors.white
                : variant === "text"
                ? Colors.primary
                : variant === "textBlack"
                ? "#000000"
                : variant === "outline"
                ? Colors.primary
                : Colors.primary
            }
          />
        ) : (
          <Text style={buttonTextStyle}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  info: {
    backgroundColor: "#007AFF", // Blue color
  },
  secondary: {
    backgroundColor: Colors.primaryDark,
  },
  text: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  textBlack: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  black: {
    backgroundColor: "#000000", // Black color
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: Colors.error,
  },
  small: {
    height: 36,
    paddingHorizontal: 16,
  },
  medium: {
    height: 44,
    paddingHorizontal: 20,
  },
  large: {
    width: "100%",
    height: 50,
    paddingHorizontal: 24,
  },
  disabled: {
    backgroundColor: Colors.gray400,
    borderColor: Colors.gray400,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  baseText: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: Colors.primaryDark,
  },
  infoText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  textText: {
    color: Colors.primary,
  },
  textBlackText: {
    color: "#000000",
  },
  blackText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.white,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 15,
  },
  largeText: {
    fontSize: 16,
  },
  disabledText: {
    color: "#000000",
  },
});
