import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Logo } from "../../components/ui/Logo";
import { Input } from "../../components/ui/input";
import { useLoginForm } from "../../hooks/useLoginForm";

export default function LoginScreen() {
  const {
    formData,
    errors,
    touched,
    isLoading,
    isFormValid,
    rememberMe,
    updateField,
    handleBlur,
    handleLogin,
    handleForgotPassword,
    toggleRememberMe,
  } = useLoginForm();

  const isDisabled = !isFormValid || isLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Logo />

          <Text style={styles.title}>Welcome Back</Text>

          <Input
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => updateField("email", text)}
            onBlur={() => handleBlur("email")}
            error={errors.email}
            showError={touched.email}
            editable={!isLoading}
          />

          <Input
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => updateField("password", text)}
            onBlur={() => handleBlur("password")}
            error={errors.password}
            showError={touched.password}
            editable={!isLoading}
          />

          <View style={styles.optionsContainer}>
            <Checkbox
              checked={rememberMe}
              onToggle={toggleRememberMe}
              label="Remember me"
              disabled={isLoading}
              style={styles.rememberMeCheckbox}
            />

            <Button
              title="Forgot password?"
              onPress={handleForgotPassword}
              variant="text"
              size="small"
              disabled={isLoading}
              style={styles.forgotButton}
            />
          </View>

          <Button
            title="Login"
            onPress={handleLogin}
            disabled={isDisabled}
            loading={isLoading}
          />
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000000",
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  rememberMeCheckbox: {
    flex: 1,
  },
  forgotButton: {
    alignSelf: "flex-end",
    width: "auto",
  },
});
