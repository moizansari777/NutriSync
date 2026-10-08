import React from "react";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "../../../macros/colors";

function FlashIcon({ active }: { active: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z"
        fill={active ? COLORS.GOLD : "none"}
        stroke={active ? COLORS.GOLD : COLORS.BACKGROUND}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FlashIcon;
