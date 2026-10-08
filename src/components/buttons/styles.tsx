import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { fontSize } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { useTheme } from "../../hooks/useTheme";

export const useStyles = () => {
  const { colors, scheme } = useTheme();

  return {
    buttonContainer: {
      borderRadius: 100,
      paddingVertical: 16,
      backgroundColor: colors.PRIMARY,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      shadowColor: colors.PRIMARY,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: scheme === "dark" ? 0.18 : 0.35,
      shadowRadius: 16,
      elevation: 3,
    } as ViewStyle,

    buttonIcon: {
      height: 22,
      width: 22,
      resizeMode: "contain",
    } as ImageStyle,

    disableButtonContainer: {
      borderRadius: 100,
      shadowOpacity: 0,
      elevation: 0,
      paddingVertical: 16,
      backgroundColor: colors.BORDER_COLOR,
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,

    socialButtonContainer: {
      height: 60,
      width: 60,
      borderRadius: 100,
      paddingVertical: 17,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.GRAY_BG,
    } as ViewStyle,

    socialButtonIcon: {
      height: 25,
      width: 25,
      resizeMode: "contain",
    } as ImageStyle,

    label: {
      fontSize: fontSize("3.9%"),
      fontFamily: FONTS.Bold_700,
      color: colors.ON_PRIMARY,
      letterSpacing: 0.2,
    } as TextStyle,
  };
};
