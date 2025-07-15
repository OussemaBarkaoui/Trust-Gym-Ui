import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "ios" ? "slide_from_right" : "fade",
        animationDuration: 300,
        gestureEnabled: Platform.OS === "ios",
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen
        name="LoginScreen"
        options={{
          title: "Login",
          animation: Platform.OS === "ios" ? "slide_from_bottom" : "fade",
          animationDuration: 400,
        }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        options={{
          title: "Forgot Password",
          presentation: Platform.OS === "ios" ? "card" : "modal",
          animation: Platform.OS === "ios" ? "slide_from_right" : "fade",
          animationDuration: 350,
        }}
      />
      <Stack.Screen
        name="OtpVerification"
        options={{
          title: "OTP Verification",
          animation: Platform.OS === "ios" ? "slide_from_right" : "fade",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="SetNewPasswordScreen"
        options={{
          title: "Set New Password",
          animation: Platform.OS === "ios" ? "slide_from_right" : "fade",
          animationDuration: 300,
        }}
      />
    </Stack>
  );
}
