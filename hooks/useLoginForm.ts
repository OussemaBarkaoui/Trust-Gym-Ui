import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { validateEmail, validatePassword } from "../utils/validation";
import { login } from "@/features/(auth)/api";
import { User } from "@/entities/User";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

interface TouchedFields {
  email: boolean;
  password: boolean;
}

export const useLoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        const validation =
          field === "email" ? validateEmail(value) : validatePassword(value);
        setErrors((prev) => ({
          ...prev,
          [field]: validation.isValid ? "" : validation.message,
        }));
      }
    },
    [touched]
  );

  const handleBlur = useCallback(
    (field: keyof TouchedFields) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const validation =
        field === "email"
          ? validateEmail(formData[field])
          : validatePassword(formData[field]);
      setErrors((prev) => ({
        ...prev,
        [field]: validation.isValid ? "" : validation.message,
      }));
    },
    [formData]
  );

  const validateForm = useCallback((): boolean => {
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);

    const newErrors: FormErrors = {
      email: emailValidation.isValid ? "" : emailValidation.message,
      password: passwordValidation.isValid ? "" : passwordValidation.message,
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return emailValidation.isValid && passwordValidation.isValid;
  }, [formData]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors below and try again.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    try {
     await login(formData as User);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Success", "Login successful!", [
        { text: "OK", style: "default" },
      ]);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again.",
        [{ text: "OK", style: "destructive" }]
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const handleForgotPassword = useCallback(() => {
    router.push("/ForgotPasswordScreen");
  }, [router]);

  const isFormValid =
    validateEmail(formData.email).isValid &&
    validatePassword(formData.password).isValid;

  return {
    formData,
    errors,
    touched,
    isLoading,
    isFormValid,
    updateField,
    handleBlur,
    handleLogin,
    handleForgotPassword,
  };
};
