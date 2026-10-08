// NutriSync palette — warm "golden arches" yellow on cream, ink-dark text.
// Keep values as 6-digit hex where possible: some styles append alpha
// suffixes (e.g. `${COLORS.GOLD}22`).

export const lightColors = {
  PRIMARY: "#FFC72C", // brand yellow — fills, active states, primary buttons
  ACCENT_TEXT: "#B07D00", // readable gold for links / accent text on light bg
  ON_PRIMARY: "#140F1F", // text & icons sitting on PRIMARY
  SECONDARY: "#140F1F", // ink — dark buttons, send button, splash
  DONUT: "#FFC72C", // highlight (camera brackets)
  ORANGE: "#FF8A3D",
  PINK: "#FFC72C", // loaders / spinners
  BACKGROUND: "#FCFAF8", // cream canvas
  ICON_COLOR: "#A8A29E",
  HEADING: "#140F1F",
  INPUT_BG: "#FFFFFF",
  INPUT_BORDER: "#EDE7DD",
  GRAY_BG: "#FFF6DC", // soft butter cards / sections
  TEXT: "#6B6474",
  RED: "#DA291C",
  GREEN: "#22C55E",
  GREEN_DARK: "#15803D",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  BLUE: "#1E3A5F",
  BORDER_COLOR: "rgba(20,15,31,.08)",
  TRANSPARENT_BG: "rgba(0,0,0,.01)",
  MIRROR_BG: "rgba(20,15,31,.55)",
  TRANSPARENT: "transparent",
  PLACEHOLDER: "#A8A29E",
  YELLOW: "#FFC72C",
  GOLD: "#FEDB71",
  YELLOW_TRANSPARENT: "#FFF6DC",
  RED_TRANSPARENT: "rgba(218, 41, 28, 0.1)",
  GREEN_TRANSPARENT: "#E3F6EA",
  GLASS_BG: "rgba(255,255,255,0.85)", // translucent card surfaces
  GLASS_BORDER: "rgba(20,15,31,0.06)",
  CAMERA_BAR_TEXT: "rgba(255,255,255,0.9)", // idle tab labels over the camera feed
  CAMERA_BAR_BG: "rgba(20,15,31,0.55)", // glass fallback over the camera
  CAMERA_BAR_BORDER: "rgba(255,255,255,0.14)",
};

export const darkColors = {
  PRIMARY: "#FFC72C", // same yellow — it already pops on dark
  ACCENT_TEXT: "#FFD45C",
  ON_PRIMARY: "#140F1F",
  SECONDARY: "#2A251F", // raised dark surface for buttons / selected pills
  DONUT: "#FFC72C",
  ORANGE: "#FF9F5A",
  PINK: "#FFC72C",
  BACKGROUND: "#12100D", // warm near-black, not pure black
  GRAY_BG: "#1D1A15", // cards / sections
  INPUT_BG: "#1D1A15", // input fields
  INPUT_BORDER: "rgba(255,255,255,0.10)",
  HEADING: "#F5F1EA", // high contrast text
  TEXT: "#B3AB9F", // secondary text
  ICON_COLOR: "#8A8378",
  PLACEHOLDER: "#7A7368",
  BORDER_COLOR: "rgba(255,255,255,0.10)",
  TRANSPARENT_BG: "rgba(255,255,255,0.02)",
  MIRROR_BG: "rgba(18, 16, 13, 0.7)",
  RED: "#FF6B5E",
  GREEN: "#4ADE80",
  GREEN_DARK: "#22C55E",
  BLUE: "#4A6FA5",
  WHITE: "#1D1A15",
  BLACK: "#000000",
  YELLOW: "#FFC72C",
  GOLD: "#FEDB71",
  YELLOW_TRANSPARENT: "#2A2414",
  RED_TRANSPARENT: "rgba(255, 107, 94, 0.15)",
  GREEN_TRANSPARENT: "#132A1C",
  TRANSPARENT: "transparent",
  GLASS_BG: "rgba(255,255,255,0.05)",
  GLASS_BORDER: "rgba(255,255,255,0.10)",
  CAMERA_BAR_TEXT: "rgba(255,255,255,0.9)", // idle tab labels over the camera feed
  CAMERA_BAR_BG: "rgba(20,15,31,0.55)", // glass fallback over the camera
  CAMERA_BAR_BORDER: "rgba(255,255,255,0.14)",
};

export const COLORS = { ...lightColors };
