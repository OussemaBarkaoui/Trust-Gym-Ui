import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface UseAnimationProps {
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
}

export const useFadeIn = ({
  duration = 600,
  delay = 0,
  easing = Easing.ease,
}: UseAnimationProps = {}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      easing,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [fadeAnim, duration, delay, easing]);

  return fadeAnim;
};

export const useSlideIn = ({
  duration = 500,
  delay = 0,
  easing = Easing.out(Easing.cubic),
  initialValue = 50,
}: UseAnimationProps & { initialValue?: number } = {}) => {
  const slideAnim = useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    const animation = Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      delay,
      easing,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [slideAnim, duration, delay, easing]);

  return slideAnim;
};

export const useScaleIn = ({
  duration = 400,
  delay = 0,
  easing = Easing.out(Easing.back(1.7)),
}: UseAnimationProps = {}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      delay,
      easing,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [scaleAnim, duration, delay, easing]);

  return scaleAnim;
};

export const useStaggeredAnimation = (
  itemCount: number,
  staggerDelay: number = 100
) => {
  const animations = useRef(
    Array.from({ length: itemCount }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animationArray = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * staggerDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    Animated.stagger(staggerDelay, animationArray).start();

    return () => {
      animations.forEach((anim) => anim.stopAnimation());
    };
  }, [animations, staggerDelay]);

  return animations;
};
