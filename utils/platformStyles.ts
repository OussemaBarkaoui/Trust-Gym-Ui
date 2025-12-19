import { Platform, ViewStyle } from "react-native";

/**
 * Create cross-platform shadow styles
 * For web, uses boxShadow. For native, uses shadow* properties.
 */
export const createShadow = (
  color: string = "#000",
  offset: { width: number; height: number } = { width: 0, height: 2 },
  opacity: number = 0.1,
  radius: number = 4,
  elevation: number = 2
): ViewStyle => {
  if (Platform.OS === "web") {
    // Convert to boxShadow for web
    const rgba = hexToRgba(color, opacity);
    return {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${rgba}`,
    } as ViewStyle;
  }

  // Native platforms (iOS/Android)
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation, // Android elevation
  };
};

/**
 * Convert hex color to rgba
 */
const hexToRgba = (hex: string, opacity: number): string => {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Common shadow presets
 */
export const shadows = {
  small: createShadow("#000", { width: 0, height: 1 }, 0.1, 2, 1),
  medium: createShadow("#000", { width: 0, height: 2 }, 0.1, 4, 2),
  large: createShadow("#000", { width: 0, height: 4 }, 0.15, 8, 4),
  xl: createShadow("#000", { width: 0, height: 8 }, 0.15, 16, 8),
};
