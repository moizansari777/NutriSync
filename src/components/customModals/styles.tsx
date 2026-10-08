import {
  ImageStyle,
  TextStyle,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fontSize, width } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { COLORS } from "../../macros/colors";
import { useTheme } from "../../hooks/useTheme";

export const useStyles = () => {
  const { colors, scheme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  return {
    modalContainer: {
      backgroundColor: "rgba(0,0,0,.55)",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    } as ViewStyle,

    innerView: {
      backgroundColor: colors.BACKGROUND,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: width(5),
      width: width(92),
      zIndex: 9999,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderWidth: scheme === "dark" ? 0.5 : 0,
      borderColor: colors.BORDER_COLOR,
    } as ViewStyle,

    confirmInnerView: {
      backgroundColor: colors.BACKGROUND,
      borderRadius: 12,
      width: width("88%"),
      zIndex: 9999,
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,

    doneIcon: {
      height: 50,
      width: 50,
      resizeMode: "contain",
    } as ImageStyle,

    dineIconView: {
      height: 70,
      width: 70,
      borderRadius: 100,
      backgroundColor: colors.INPUT_BG,
      justifyContent: "center",
      alignItems: "center",
    } as ImageStyle,

    updateAppImage: {
      height:width(50), 
      width: width(50),
    } as ImageStyle,

    updateAppImageModel: {
     height: SCREEN_HEIGHT / 3,
      width: width(80),
      marginBottom:15
    } as ImageStyle,

    textContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: width(1),
    } as ViewStyle,

    confirmTextContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: width(5),
      paddingHorizontal: 15,
    } as ViewStyle,

    modalTitle: {
      fontSize: fontSize(4),
      fontFamily: FONTS.SemiBold_600,
      color: colors.HEADING,
      letterSpacing: 0.4,
    } as TextStyle,

    modalTagLine: {
      fontSize: fontSize(3.5),
      fontFamily: FONTS.Regular_400,
      color: colors.TEXT,
      textAlign: "center",
      marginTop: 4,
      letterSpacing: 0.4,
    } as TextStyle,

    headingText: {
      fontSize: fontSize(4.5),
      color: colors.BLACK,
      fontFamily: FONTS.SemiBold_600,
      letterSpacing: 0.4,
    } as TextStyle,

    subHeadingText: {
      fontSize: fontSize(3.5),
      color: colors.HEADING,
      fontFamily: FONTS.Regular_400,
      textAlign: "center",
      marginTop: 4,
      letterSpacing: 0.4,
    } as TextStyle,

    cancel: {
      fontSize: fontSize(3),
      fontFamily: FONTS.Regular_400,
      textAlign: "center",
      marginTop: 10,
      letterSpacing: 0.4,
    } as TextStyle,

    buttonContainer: {
      width: "50%",
      marginTop: width(10),
    } as ViewStyle,

    updateButtonContainer: {
      width: "70%",
      marginTop: width(5),
      gap: 12,
      paddingBottom: 20,
    } as ViewStyle,

    confirmButtonContainer: {
      width: "100%",
      marginTop: width(6),
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 0.3,
      borderTopColor: colors.ICON_COLOR,
    } as ViewStyle,

    bottomButtonView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 16,
    } as ViewStyle,

    bottomButtonViewBorder: {
      borderLeftWidth: 0.3,
      borderLeftColor: colors.ICON_COLOR,
    } as ViewStyle,

    cancelButtonText: {
      color: colors.TEXT,
      fontFamily: FONTS.Medium_500,
      fontSize: fontSize(3.4),
      letterSpacing: 0.5,
    } as TextStyle,

    logoutButtonText: {
      color: colors.RED,
      fontFamily: FONTS.SemiBold_600,
      fontSize: fontSize(3.4),
      letterSpacing: 0.5,
    } as TextStyle,

    // ===== sheet
    sheetContainer: {
      backgroundColor: "rgba(0,0,0,.55)",
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      overflow: "hidden",
      paddingBottom: bottom + 15,
    } as ViewStyle,

    cardContainer: {
      width: "100%",
      gap: 10,
      marginTop: 25,
      paddingHorizontal: 10,
    } as ViewStyle,

    sheetButtonContainer: {
      width: "50%",
      marginTop: 25,
    } as ViewStyle,
  };
};
