import { ImageStyle, TextStyle, ViewStyle, Platform } from "react-native";
import { fontSize, width } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { COLORS } from "../../macros/colors";
import { useTheme } from "../../hooks/useTheme";

// How far the right-hand slot sits from the field's right edge, and the gap
// left between the typed value and whatever that slot renders. The value's
// own padding is derived from these plus the slot's measured width, so the
// text is pushed aside by exactly as much as the slot occupies and no more.
export const INSIDE_RIGHT_INSET = 12;
export const INSIDE_RIGHT_GAP = 8;

export const useStyles = () => {
  const { colors } = useTheme();

  return {
    inputFieldMain: {
      position: "relative",
    } as ViewStyle,

    inputStyle: {
      width: "100%",
      borderWidth: 1,
      borderRadius: 16,
      paddingHorizontal: 17,
      paddingVertical: Platform.OS === "ios" ? 17 : 17,
      borderColor: colors.INPUT_BORDER,
      backgroundColor: colors.INPUT_BG,
      color: colors.BLACK,
      justifyContent: "center",
      alignItems: "center",
      fontSize: fontSize(3.5),
      letterSpacing: 0.5,
    } as ViewStyle,

    ifIcon: {
      paddingLeft: 45,
    } as ViewStyle,

    textareaStyle: {
      minHeight: 150,
    },

    focusedBorder: {
      borderColor: colors.PRIMARY,
    },

    iconStyle: {
      top: Platform.OS === "ios" ? 18 : 16,
      right: 15,
      position: "absolute",
    } as ImageStyle,

    leftIconStyle: {
      top: Platform.OS === "ios" ? 15 : 15,
      left: 15,
      position: "absolute",
    } as ImageStyle,

    // Right-aligned slot inside the field. Stretched top-to-bottom so its
    // content stays vertically centred on any font scale, unlike the eye
    // icon's hard-coded `top`.
    insideRightUI: {
      position: "absolute",
      right: INSIDE_RIGHT_INSET,
      top: 0,
      bottom: 0,
      maxWidth: width(45),
      justifyContent: "center",
    } as ViewStyle,

    eyeIcon: {
      height: 20,
      width: 20,
      resizeMode: "contain",
    } as ImageStyle,

    labelView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 3,
    } as ViewStyle,

    inputLabel: {
      fontSize: fontSize(3.5),
      fontFamily: FONTS.Medium_500,
      color: colors.HEADING,
      marginBottom: width(1.2),
      letterSpacing: 0.5,
    } as TextStyle,

    errorText: {
      fontSize: fontSize(3.2),
      fontWeight: "500",
      color: colors.RED,
      marginTop: width(1.5),
    } as TextStyle,

    required: {
      color: colors.RED,
    } as TextStyle,

    // Error on the left, character counter on the right — one row so the
    // counter keeps its place instead of being pushed down when a validation
    // message appears.
    helperRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      // `flex-end` keeps the counter hard right even when there is no error
      // text beside it; the error itself takes the remaining width.
      justifyContent: "flex-end",
    } as ViewStyle,

    helperError: {
      flex: 1,
      marginRight: 8,
    } as TextStyle,

    charCount: {
      fontSize: fontSize(3),
      fontFamily: FONTS.Medium_500,
      color: colors.ICON_COLOR,
      marginTop: width(1.5),
      letterSpacing: 0.5,
    } as TextStyle,

    charCountLimit: {
      color: colors.RED,
    } as TextStyle,
  };
};
