import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "ios" ? "slide_from_right" : "fade",
        animationDuration: 300,
        gestureEnabled: Platform.OS === "ios",
        gestureDirection: "horizontal",
        animationTypeForReplace: "push",
      }}
    >
      <Stack.Screen
        name="(auth)"
        options={{
          animation: Platform.OS === "ios" ? "slide_from_right" : "fade",
          animationDuration: 250,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          animation: Platform.OS === "ios" ? "slide_from_left" : "fade",
          animationDuration: 350,
          gestureEnabled: false, // Disable gesture for tabs
        }}
      />
    </Stack>
  );
}
