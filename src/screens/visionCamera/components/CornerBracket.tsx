import React from "react";
import Svg, { G, Path } from "react-native-svg";
import { COLORS } from "../../../macros/colors";
import { C_THICK, CORNER_SZ } from "../styles";

export function CornerBracket({
  deg = 0,
  color = COLORS.DONUT,
}: {
  deg?: number;
  color?: string;
}) {
  const cx = (CORNER_SZ + 4) / 2;
  return (
    <Svg
      width={CORNER_SZ + 4}
      height={CORNER_SZ + 4}
      viewBox={`0 0 ${CORNER_SZ + 4} ${CORNER_SZ + 4}`}
    >
      <G transform={`rotate(${deg}, ${cx}, ${cx})`}>
        <Path
          d={`M ${C_THICK / 2 + 2} 2 L ${C_THICK / 2 + 2} ${CORNER_SZ + 2}`}
          stroke={color}
          strokeWidth={C_THICK}
          strokeLinecap="round"
        />
        <Path
          d={`M 2 ${C_THICK / 2 + 2} L ${CORNER_SZ + 2} ${C_THICK / 2 + 2}`}
          stroke={color}
          strokeWidth={C_THICK}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
