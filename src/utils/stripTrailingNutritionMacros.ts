const MACRO_KEYS = ["Name", "Protein", "Proteins", "Calories", "Water", "Carbs", "Fats", "Fat", "LOG[_ ]?ACTION", "LOG[_ ]?MULTIPLIER"];

const TRAILING_MACROS = new RegExp(
  `(?:\\s*(?:${MACRO_KEYS.join("|")})\\s*:\\s*[^:\\n]+)+\\s*$`,
  "i",
);

export function stripTrailingNutritionMacros(text?: string): string {
  if (!text) return "";
  return text.replace(TRAILING_MACROS, "").trim();
}
