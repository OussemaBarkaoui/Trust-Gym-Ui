import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'slide_from_right' : 'fade',
        animationDuration: 250,
      }}
    >
      <Stack.Screen 
        name="LoginScreen" 
        options={{
          title: "Login",
        }} 
      />
      <Stack.Screen 
        name="ForgotPasswordScreen"
        options={{
          title: "Forgot Password",
          presentation: Platform.OS === 'ios' ? 'card' : 'modal',
        }}
      />
    </Stack>
  );
}