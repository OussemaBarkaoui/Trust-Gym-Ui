import { Alert, Platform, ToastAndroid } from "react-native";

interface ShowMessageOptions {
  title?: string;
  message: string;
  type?: "success" | "error" | "info";
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: "default" | "cancel" | "destructive";
  }>;
}

export const showMessage = ({
  title,
  message,
  type = "info",
  buttons = [{ text: "OK" }],
}: ShowMessageOptions) => {
  if (Platform.OS === "android") {
    // Use ToastAndroid for Android
    const duration =
      type === "error" || type === "success"
        ? ToastAndroid.LONG
        : ToastAndroid.SHORT;
    const displayMessage = title ? `${title}: ${message}` : message;
    ToastAndroid.show(displayMessage, duration);

    // If there are multiple buttons or custom actions, still show Alert for complex interactions
    if (
      buttons.length > 1 ||
      buttons.some((btn) => btn.onPress && btn.text !== "OK")
    ) {
      Alert.alert(title || "Notification", message, buttons);
    } else if (buttons[0]?.onPress) {
      // Execute the onPress callback for simple OK button
      buttons[0].onPress();
    }
  } else {
    // Use Alert for iOS
    Alert.alert(title || "Notification", message, buttons);
  }
};

export const showSuccess = (message: string, title?: string) => {
  showMessage({ title: title || "Success", message, type: "success" });
};

export const showError = (message: string, title?: string) => {
  showMessage({ title: title || "Error", message, type: "error" });
};

export const showInfo = (message: string, title?: string) => {
  showMessage({ title: title || "Info", message, type: "info" });
};

export const showConfirmation = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  title?: string
) => {
  showMessage({
    title: title || "Confirmation",
    message,
    buttons: [
      {
        text: "Cancel",
        style: "cancel",
        onPress: onCancel,
      },
      {
        text: "OK",
        onPress: onConfirm,
      },
    ],
  });
};
