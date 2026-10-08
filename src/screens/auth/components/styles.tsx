import { ViewStyle, TextStyle, ImageStyle, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fontSize, height, width } from "../../../utils/responsiveSize";
import { FONTS } from "../../../assets/fonts";
import { mainHPadding } from "../../../constant";
import { COLORS } from "../../../macros/colors";
import { useTheme } from "../../../hooks/useTheme";

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();

  return {
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
      paddingTop: Platform.OS === "ios" ? height(3.2) : height(2.8),
      paddingBottom: bottom,
    } as ViewStyle,

    header: {
      height: height(6),
      paddingHorizontal: mainHPadding,
      justifyContent: "center",
    } as ViewStyle,

    iconBackContainer: {
      marginBottom: height(1.2),
    } as ViewStyle,

    textContainer: {
      marginTop: height(3.5),
      marginBottom: height(2.5),
      paddingHorizontal: mainHPadding,
    } as ViewStyle,

    backIcon: {
      width: 34,
      height: 34,
      resizeMode: "contain",
    } as ImageStyle,

    logo: {
      height: width(17),
      width: width(30),
      resizeMode: "contain",
    } as ImageStyle,

    textTopContainer: {
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    } as ViewStyle,

    headingContainer: {
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    } as ViewStyle,

    rightUIMain: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: height(2),
    } as ViewStyle,

    headingText: {
      fontSize: height("2.8%"),
      color: colors.HEADING,
      fontFamily: FONTS.Bold_700,
      letterSpacing: 0.4,
    } as TextStyle,

    subHeadingText: {
      fontSize: height("1.75%"),
      color: colors.TEXT,
      fontFamily: FONTS.Medium_500,
      textAlign:"center",
      letterSpacing: 0.4,
    } as TextStyle,

    childContainer: {
      paddingHorizontal: mainHPadding,
    } as ViewStyle,

    googleButton: {
      backgroundColor: colors.INPUT_BG,
    } as ViewStyle,

    socialButtonContainer: {
      flex: 1,
      paddingHorizontal: mainHPadding,
      alignItems: "center",
      marginTop: height(5),
    } as ViewStyle,

    socialButtonView: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 15,
      borderWidth: 0.7,
      borderColor: colors.INPUT_BORDER,
      borderRadius: 100,
      paddingVertical: 16,
    } as ViewStyle,

    orContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 15,
      paddingBottom: height(2),
    } as ViewStyle,

    divider: {
      backgroundColor: colors.INPUT_BORDER,
      height: 1,
      flex: 1,
    } as ViewStyle,

    socialButtonsInner: {
      width: "100%",
      gap: 12,
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,

    googleTextStyle: {
      color: colors.HEADING,
    } as TextStyle,

    continue: {
      fontSize: fontSize(3.5),
      fontFamily: FONTS.Medium_500,
      letterSpacing: 0.5,
      color: colors.ICON_COLOR,
    } as TextStyle,

    appleButton: {
      backgroundColor: colors.SECONDARY,
    } as ViewStyle,

    appleButtonText: {
      color: colors.WHITE,
    } as TextStyle,

    socialButtonIcon: {
      height: 25,
      width: 25,
      resizeMode: "contain",
    } as ImageStyle,

    socialButtonText: {
      fontSize: fontSize(3.5),
      fontFamily: FONTS.Medium_500,
      color: colors.HEADING,
      letterSpacing: 0.5,
    } as TextStyle,

    // ==== OTP
    otpContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop:10
    } as ViewStyle,

    input: {
      width: 48,
      height: 65,
      textAlign: "center",
      fontSize: fontSize(5.5),
      borderWidth: 1,
      borderRadius: 16,
      color: colors.HEADING,
    } as ViewStyle,

    filledInput: {
      borderColor: colors.PRIMARY,
    } as ViewStyle,

    emptyInput: {
      borderColor: colors.INPUT_BORDER,
    } as ViewStyle,
  };
};
