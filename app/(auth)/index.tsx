import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  
} from "react-native";
import appLogo from "../../assets/images/appLogoNobg.png";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const isDisabled = !email || !password;

  // Animation value
  const logoScale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.Image
          style={[styles.image, { transform: [{ scale: logoScale }] }]}
          source={appLogo}
        />

        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={
            styles.input
          }
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={
            styles.input
          }
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          underlineColorAndroid="transparent"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => router.push("/ForgotPasswordScreen")}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          disabled={isDisabled}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCFCFC",
    paddingHorizontal: 20,
  },
  image: {
    height: 200,
    width: 350,
    marginBottom: 20,
    resizeMode: "contain",
  },
  buttonDisabled: {
    backgroundColor: "#B0B0B0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 18,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  forgotText: {
    color: "#2A4E62",
    fontSize: 14,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#015ACD",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
