import { User } from "@/entities/User";
import { login } from "@/features/(auth)/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSession } from "../contexts/SessionContext";
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

const REMEMBER_ME_KEY = "@trust_gym_remember_me";
const SAVED_EMAIL_KEY = "@trust_gym_saved_email";

export const useLoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({ email: "", password: "" });
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const {
    login: sessionLogin,
    getSavedEmail,
    isRememberMeEnabled,
  } = useSession();

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedRememberMe = await isRememberMeEnabled();
        const savedEmail = await getSavedEmail();

        if (savedRememberMe && savedEmail) {
          setRememberMe(true);
          setFormData((prev) => ({ ...prev, email: savedEmail }));
        }
      } catch (error) {}
    };

    loadSavedData();
  }, [getSavedEmail, isRememberMeEnabled]);

  const toggleRememberMe = useCallback(() => {
    setRememberMe((prev) => !prev);
  }, []);

  const saveLoginData = useCallback(
    async (email: string, remember: boolean) => {
      try {
        if (remember) {
          await AsyncStorage.setItem(REMEMBER_ME_KEY, "true");
          await AsyncStorage.setItem(SAVED_EMAIL_KEY, email);
        } else {
          await AsyncStorage.removeItem(REMEMBER_ME_KEY);
          await AsyncStorage.removeItem(SAVED_EMAIL_KEY);
        }
      } catch (error) {}
    },
    []
  );

  const validateField = useCallback(
    async (
      field: keyof FormData,
      value: string,
      updatedFormData?: FormData
    ) => {
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
            newErrors[validationError.path as keyof FormErrors] =
              validationError.message;
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
      const response = await login(formData as User);
      const apiResponse = response.data;

      const loginResponse = {
        accessToken: apiResponse.token,
        refreshToken: apiResponse.refreshToken,
        user: {
          id: apiResponse.id,
          firstName: apiResponse.firstName,
          lastName: apiResponse.lastName,
          email: apiResponse.email,
          status: "ENABLED" as const,
          role: apiResponse.role
            ? {
                id: apiResponse.role.id,
                title: apiResponse.role.title,
              }
            : undefined,
          partner: apiResponse.partnerId
            ? {
                id: apiResponse.partnerId,
                name: "Partner",
              }
            : undefined,
        },
        expiresIn: 3600,
      };

      if (
        !loginResponse.accessToken ||
        !loginResponse.refreshToken ||
        !loginResponse.user
      ) {
        throw new Error("Invalid login response format");
      }

      await sessionLogin(loginResponse, rememberMe);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTimeout(() => {
        router.replace("/(tabs)/DashBoardScreen");
      }, 200);
    } catch (error: any) {
      let errorMessage = "Invalid email or password. Please try again.";

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.message) {
        if (error.message.includes("Invalid login response format")) {
          errorMessage = "Server response error. Please try again.";
        }
      }

      Alert.alert("Login Failed", errorMessage, [
        { text: "OK", style: "destructive" },
      ]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [formData, validateForm, rememberMe, sessionLogin]);

  const handleForgotPassword = useCallback(() => {
    router.push("/ForgotPasswordScreen");
  }, [router]);

  const isFormValid =
    !errors.email &&
    !errors.password &&
    formData.email !== "" &&
    formData.password !== "";

  return {
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
  };
};
