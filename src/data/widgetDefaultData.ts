import { Macro } from "../schemas/types";

/**
 * Single source of truth for the key the Android widget payload is stored under.
 * The app writes it, the headless widget task handler reads it — they must match.
 */
export const WIDGET_STORAGE_KEY = "MacroWidget";

export type WidgetScheme = "light" | "dark";

export type WidgetPayload = {
  macrosData: Macro[];
  scheme: WidgetScheme;
};

/**
 * Shown until the Log TDEE screen pushes real values. Keep all four rows so the
 * widget has the same shape whether or not it has data yet.
 */
export const WIDGET_DEFAULT_DATA: Macro[] = [
  { title: "Calories (kcal)", total: "0", tracked: "0", color: "#DEDEDE" },
  { title: "Protein (g)", total: "0", tracked: "0", color: "#DEDEDE" },
  { title: "Water (ltr)", total: "0", tracked: "0", color: "#DEDEDE" },
];

export const WIDGET_DEFAULT_PAYLOAD: WidgetPayload = {
  macrosData: WIDGET_DEFAULT_DATA,
  scheme: "light",
};
