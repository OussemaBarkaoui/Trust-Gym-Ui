import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/features/(auth)/api";
import { User } from "@/entities/User";
import { loginSchema } from "../utils/validation";

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
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({ email: "", password: "" });
  const [touched, setTouched] = useState<TouchedFields>({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Helper to validate a single field with Yup, always using the passed value set
  const validateField = useCallback(
    async (field: keyof FormData, value: string, updatedFormData?: FormData) => {
      const values = updatedFormData || { ...formData, [field]: value };
      try {
        await loginSchema.validateAt(field, values);
        setErrors((prev) => ({ ...prev, [field]: "" }));
      } catch (err: any) {
        setErrors((prev) => ({ ...prev, [field]: err.message }));
      }
    },
    [formData]
  );

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };
        if (touched[field]) {
          // Pass updated value to validation to avoid stale closure
          validateField(field, value, updated);
        }
        return updated;
      });
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof TouchedFields) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, formData[field]);
    },
    [formData, validateField]
  );

  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({ email: "", password: "" });
      setTouched({ email: true, password: true });
      return true;
    } catch (err: any) {
      const newErrors: FormErrors = { email: "", password: "" };
      if (err.inner) {
        err.inner.forEach((validationError: any) => {
          if (validationError.path) {
            newErrors[validationError.path as keyof FormErrors] = validationError.message;
          }
        });
      }
      setErrors(newErrors);
      setTouched({ email: true, password: true });
      return false;
    }
  }, [formData, loginSchema]);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    if (!(await validateForm())) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors below and try again.",
        [{ text: "OK", style: "default" }]
      );
      setIsLoading(false);
      return;
    }

    try {
      await login(formData as User);

      // Simulate loading
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

  // Button is enabled if all fields are touched/valid and not empty
  const isFormValid =
    !errors.email && !errors.password && formData.email !== "" && formData.password !== "";

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