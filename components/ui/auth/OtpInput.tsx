import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
};

export const OtpInput: React.FC<Props> = ({
  length = 6,
  value,
  onChange,
  editable = true,
}) => {
  const refs = Array.from({ length }, () => useRef<TextInput>(null));

  const handleChange = (text: string, idx: number) => {
    let chars = text.replace(/[^0-9]/g, "");
    if (chars.length > 1) {
      // Paste or autofill
      chars = chars.slice(0, length - idx);
      let arr = value.split("");
      for (let i = 0; i < chars.length; ++i) {
        arr[idx + i] = chars[i];
        if (idx + i + 1 < length)
          refs[idx + i + 1]?.current?.focus();
      }
      onChange(arr.join("").slice(0, length));
    } else {
      let arr = value.split("");
      arr[idx] = chars;
      onChange(arr.join("").slice(0, length));
      if (chars && idx < length - 1) refs[idx + 1]?.current?.focus();
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      (!value[idx] || value[idx] === "")
    ) {
      if (idx > 0) refs[idx - 1]?.current?.focus();
    }
  };

  return (
    <View style={styles.otpRow}>
      {Array.from({ length }).map((_, idx) => (
        <TextInput
          ref={refs[idx]}
          key={idx}
          style={[
            styles.otpCell,
            value[idx] ? styles.otpCellFilled : undefined,
          ]}
          keyboardType="numeric"
          maxLength={1}
          value={value[idx] || ""}
          onChangeText={(text) => handleChange(text, idx)}
          onKeyPress={(e) => handleKeyPress(e, idx)}
          editable={editable}
          selectTextOnFocus
          textAlign="center"
          autoFocus={idx === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
    gap: 10,
  },
  otpCell: {
    width: 48,
    height: 50,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    fontSize: 20,
    color: "#222",
    textAlign: "center",
  },
  otpCellFilled: {
    borderColor: "#2A4E62",
    backgroundColor: "#f4f4f7",
  },
});