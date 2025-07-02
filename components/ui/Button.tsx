import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'large',
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;
  const displayTitle = loading ? 'Loading...' : title;

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    isDisabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <Text style={buttonTextStyle}>{displayTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    backgroundColor: '#015ACD',
  },
  secondary: {
    backgroundColor: '#2A4E62',
  },
  text: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
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
    width: '100%',
    height: 50,
    paddingHorizontal: 24,
  },
  disabled: {
    backgroundColor: '#B0B0B0',
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  textText: {
    color: '#2A4E62',
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
    color: '#666',
  },
});