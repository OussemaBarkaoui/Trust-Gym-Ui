import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, ImageStyle } from 'react-native';
import appLogo from '../../assets/images/appLogoNobg.png';

interface LogoProps {
  style?: ImageStyle;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  style, 
  animate = true 
}) => {
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
      source={appLogo}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 200,
    width: 350,
    marginBottom: 30,
    resizeMode: 'contain',
  },
});