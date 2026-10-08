import React, { forwardRef, memo, useMemo } from "react";
import { Text, TextProps, StyleSheet, TextStyle } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../states/store/store";

type Props = TextProps;

const AppText = forwardRef<Text, Props>(
  ({ style, allowFontScaling = false, ...props }, ref) => {
    const scale = useSelector(
      (state: RootState) => state.settingReducer.textScaleValue ?? 1,
    );

    const scaledStyle = useMemo(() => {
      const flat = StyleSheet.flatten(style) as TextStyle | undefined;

      if (!flat?.fontSize) return style;

      const { fontSize, ...rest } = flat;

      return [
        rest,
        {
          fontSize: fontSize * scale,
        },
      ];
    }, [style, scale]);

    return (
      <Text
        ref={ref}
        style={scaledStyle}
        allowFontScaling={allowFontScaling}
        {...props}
      />
    );
  },
);

AppText.displayName = "AppText";

export default memo(AppText);
