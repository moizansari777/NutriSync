"use no memo";
import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";
import { Macro, MacrosProps } from "../../schemas/types";
import { FONTS } from "../../assets/fonts";
import { WidgetScheme } from "../../data/widgetDefaultData";

/**
 * IMPORTANT: nothing in this file may call a React hook.
 * react-native-android-widget does not render these components through React —
 * it invokes them as plain functions (see build-widget-tree.ts) to serialize the
 * tree into Android RemoteViews. Any hook (useState / useEffect / useSelector /
 * useColorScheme, or a custom hook wrapping them such as useTheme) throws
 * "Invalid hook call" and the widget renders empty. Theme has to arrive as a prop.
 *
 * LAYOUT: RemoteViews cannot measure and re-flow, so nothing here may use a fixed
 * pixel width or rely on content-driven height — that is what previously pushed
 * Water and Sleep off the bottom of the widget. Instead every row is a weighted
 * (`flex`) band of `match_parent`, so the six macros always divide whatever space
 * the launcher actually gives the widget, at any size the user resizes it to.
 */

type HexColor = `#${string}`;

const getPalette = (
  scheme: WidgetScheme,
): {
  background: HexColor;
  text: HexColor;
  muted: HexColor;
  track: HexColor;
} => ({
  background: scheme === "dark" ? "#0F1115" : "#FFFFFF",
  text: scheme === "dark" ? "#DEDCDC" : "#1D2939",
  muted: scheme === "dark" ? "#9AA1AC" : "#667085",
  track: scheme === "dark" ? "#2A2E37" : "#EDF1F0",
});

/** Widgets only understand hex / rgba — anything else renders as white. */
const toWidgetColor = (color: unknown, fallback: HexColor): HexColor => {
  if (
    typeof color === "string" &&
    (color.startsWith("#") || color.startsWith("rgba"))
  ) {
    return color as HexColor;
  }
  return fallback;
};

const BAR_HEIGHT = 6;
/**
 * Android LinearLayout weights are read as ints (BaseWidget.java `getInt`), so
 * the fill ratio is expressed against this scale rather than as a fraction.
 */
const WEIGHT_SCALE = 1000;

function ProgressBar({
  macro,
  scheme,
}: {
  macro: Macro;
  scheme: WidgetScheme;
}) {
  const palette = getPalette(scheme);
  const tracked = Number(macro?.tracked) || 0;
  const total = Number(macro?.total) || 0;

  const progress = total > 0 ? Math.min(Math.max(tracked / total, 0), 1) : 0;
  const filled = Math.round(progress * WEIGHT_SCALE);
  const remaining = WEIGHT_SCALE - filled;

  return (
    <FlexWidget
      style={{
        width: "match_parent",
        height: BAR_HEIGHT,
        marginTop: 4,
        backgroundColor: palette.track,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* width 0 + weight => the fill is a true percentage of the track at any widget width */}
      <FlexWidget
        style={{
          width: 0,
          height: BAR_HEIGHT,
          flex: filled,
          backgroundColor: toWidgetColor(macro?.color, palette.track),
          borderRadius: 50,
        }}
      />
      <FlexWidget
        style={{
          width: 0,
          height: BAR_HEIGHT,
          flex: remaining,
        }}
      />
    </FlexWidget>
  );
}

function MacroRow({ macro, scheme }: { macro: Macro; scheme: WidgetScheme }) {
  const palette = getPalette(scheme);

  return (
    <FlexWidget
      style={{
        width: "match_parent",
        height: 0,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <FlexWidget
        style={{
          width: "match_parent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextWidget
          text={String(macro?.title ?? "")}
          maxLines={1}
          truncate="END"
          allowFontScaling={false}
          style={{
            fontSize: 13,
            color: palette.muted,
            fontFamily: FONTS.Medium_500,
          }}
        />

        {/* Tracked / Target */}
        <FlexWidget
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextWidget
            text={String(macro?.tracked ?? "0")}
            maxLines={1}
            allowFontScaling={false}
            style={{
              fontSize: 13,
              color: palette.text,
              fontFamily: FONTS.SemiBold_600,
            }}
          />
          <TextWidget
            text={` / ${String(macro?.total ?? "0")}`}
            maxLines={1}
            allowFontScaling={false}
            style={{
              fontSize: 13,
              color: palette.muted,
              fontFamily: FONTS.Regular_400,
            }}
          />
        </FlexWidget>
      </FlexWidget>

      <ProgressBar macro={macro} scheme={scheme} />
    </FlexWidget>
  );
}

export function AndroidMacrosWidgetView({
  macrosData,
  scheme = "light",
}: MacrosProps) {
  const palette = getPalette(scheme);

  if (!macrosData || macrosData.length === 0) {
    return (
      <FlexWidget
        style={{
          height: "match_parent",
          width: "match_parent",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: palette.background,
          borderRadius: 16,
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text="No data found"
          allowFontScaling={false}
          style={{
            fontSize: 14,
            color: palette.muted,
            fontFamily: FONTS.Medium_500,
          }}
        />
      </FlexWidget>
    );
  }

  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: palette.background,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        flexDirection: "column",
        alignItems: "flex-start",
      }}
      clickAction="OPEN_APP"
    >
      {macrosData.map((macro: Macro, index: number) => (
        <MacroRow key={index} macro={macro} scheme={scheme} />
      ))}
    </FlexWidget>
  );
}
