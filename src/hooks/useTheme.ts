import { useColorScheme } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../states/store/store";
import { darkColors, lightColors } from "../macros/colors";

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const themeMode = useSelector(
    (state: RootState) => state.settingReducer?.themeMode,
  );

  const scheme = themeMode === "system" ? systemScheme : themeMode;

  const colors = scheme === "dark" ? darkColors : lightColors;

  return { colors, scheme };
};
