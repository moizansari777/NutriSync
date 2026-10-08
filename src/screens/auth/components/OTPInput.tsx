import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
} from "react-native";
import { useStyles } from "./styles";

interface OtpInputProps {
  digits?: 4 | 6;
  onChangeOtp?: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ digits = 4, onChangeOtp }) => {
  const styles = useStyles();

  const [otp, setOtp] = useState<string[]>(Array(digits).fill(""));
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onChangeOtp?.(newOtp.join(""));

    if (text && index < digits - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      otp[index] === "" &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array.from({ length: digits }).map((_, index) => (
        <TextInput
        allowFontScaling={false}
          key={index}
          ref={(ref: TextInput | null) => {
            inputsRef.current[index] = ref;
          }}
          style={[
            styles.input,
            otp[index] ? styles.filledInput : styles.emptyInput,
          ]}
          keyboardType="number-pad"
          maxLength={1}
          value={otp[index]}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

export default OtpInput;
