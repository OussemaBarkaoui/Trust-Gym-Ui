import React, { useEffect, useRef } from "react";
import { Animated, ImageStyle, StyleSheet } from "react-native";
import appLogopng from "../../../assets/images/appLogoNobg.png";

interface LogoProps {
  style?: ImageStyle;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ style, animate = true }) => {
  const logoScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animate) {
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [logoScale, animate]);

  return (
    <Animated.Image
      style={[
        styles.logo,
        animate && { transform: [{ scale: logoScale }] },
        style,
      ]}
      source={appLogopng}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 200,
    width: 350,
    marginBottom: 30,
    resizeMode: "contain",
  },
});
