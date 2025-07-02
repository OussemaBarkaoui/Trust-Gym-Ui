import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import appLogo from "../../assets/images/appLogoNobg.png";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0)).current;
  const isDisabled = !email;

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBackPress = () => {
    router.back();
  };

  const handleSendResetLink = () => {
    
    console.log("Sending reset link to:", email);
    
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          {Platform.OS === 'ios' ? (
            
            <View style={styles.iosBackButton}>
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
              <Text style={styles.iosBackText}>Login</Text>
            </View>
          ) : (
          
            <Ionicons name="arrow-back" size={24} color="#2A4E62" />
          )}
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Forgot Password</Text>
        
       
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.Image
            style={[styles.image, { transform: [{ scale: logoScale }] }]}
            source={appLogo}
          />

          <Text style={styles.title}>Forgot your password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send instructions to reset it.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            disabled={isDisabled}
            onPress={handleSendResetLink}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>

          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 12, // Reduced iOS padding
    backgroundColor: "#FCFCFC",
    borderBottomWidth: Platform.OS === 'android' ? StyleSheet.hairlineWidth : 0,
    borderBottomColor: '#E0E0E0',
    minHeight: Platform.OS === 'ios' ? 44 : 56, // Standard header heights
    marginTop: Platform.OS === 'ios' ? -50 : 0, // Move iOS header up
  },
  backButton: {
    padding: 4,
    minWidth: 60,
    alignItems: 'flex-start',
  },
  iosBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iosBackText: {
    color: '#007AFF',
    fontSize: 17,
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1, // Take remaining space for better centering
  },
  headerRight: {
    minWidth: 60,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  image: {
    height: 150,
    width: 200,
    marginBottom: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#2A4E62",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#B0B0B0",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToLoginButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backToLoginText: {
    color: "#2A4E62",
    fontSize: 16,
    textAlign: "center",
  },
});