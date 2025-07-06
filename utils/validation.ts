export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      isValid: false,
      message: "Email is required",
    };
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      message: "Please enter a valid email address",
    };
  }

  if (trimmedEmail.length > 254) {
    return {
      isValid: false,
      message: "Email address is too long",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      message: "Password is required",
    };
  }

  if (password.length < 1) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: "Password is too long",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

export const validateStrongPassword = (password: string): ValidationResult => {
  const basicValidation = validatePassword(password);

  if (!basicValidation.isValid) {
    return basicValidation;
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

export const validateEmailRealTime = (
  email: string
): {
  isValid: boolean;
  isPartiallyValid: boolean;
  message: string;
  showError: boolean;
} => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      isValid: false,
      isPartiallyValid: false,
      message: "",
      showError: false,
    };
  }

  if (trimmedEmail.includes("@")) {
    const validation = validateEmail(trimmedEmail);
    return {
      isValid: validation.isValid,
      isPartiallyValid: !validation.isValid && trimmedEmail.length > 3,
      message: validation.message,
      showError: !validation.isValid && trimmedEmail.length > 5,
    };
  }

  return {
    isValid: false,
    isPartiallyValid: trimmedEmail.length > 0,
    message: "",
    showError: false,
  };
};
