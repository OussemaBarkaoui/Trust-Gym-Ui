import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '../../components/ui/Logo';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/Button';
import { useLoginForm } from '../../hooks/useLoginForm';

export default function LoginScreen() {
  const {
    formData,
    errors,
    touched,
    isLoading,
    isFormValid,
    updateField,
    handleBlur,
    handleLogin,
    handleForgotPassword,
  } = useLoginForm();

  const isDisabled = !isFormValid || isLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            onChangeText={(text) => updateField('email', text)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            showError={touched.email}
            editable={!isLoading}
          />

          <Input
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
            showError={touched.password}
            editable={!isLoading}
          />

          <Button
            title="Forgot password?"
            onPress={handleForgotPassword}
            variant="text"
            size="small"
            disabled={isLoading}
            style={styles.forgotButton}
          />

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
    backgroundColor: '#FCFCFC',
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000000',
    textAlign: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    width: 'auto',
  },
});