/**
 * Live macro suggestion engine.
 *
 * There are exactly two calculation modes, and calories always win:
 *
 * 1. CALORIES ENTERED  → calories take priority. Protein, carbs, and fat are
 *    (re)generated from the predefined calorie split, ignoring any macro values
 *    the user may have already typed.
 *        Protein = (Calories × 0.25) / 4
 *        Carbs   = (Calories × 0.45) / 4
 *        Fat     = (Calories × 0.30) / 9
 *    e.g. 2400 kcal → Protein 150g, Carbs 270g, Fat 80g.
 *
 * 2. CALORIES NOT ENTERED → calories are derived from the entered macros:
 *        Calories = (Protein × 4) + (Carbs × 4) + (Fat × 9)
 *
 * The main entry point, `generateMacroSuggestions`, takes the current values of
 * every field and returns a full, self-consistent breakdown. It is pure and
 * cheap, so it can be called on every keystroke to update suggestions live as
 * the user types.
 */

/** A single macro/energy field. */
export type MacroField = "calories" | "protein" | "carbs" | "fat";

/** A full macro breakdown. All values are grams except `calories` (kcal). */
export interface MacroSuggestion {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  /**
   * How the breakdown was produced:
   * - "from-calories": calories were entered; macros derived from ratios.
   * - "from-macros":   calories were derived from the entered macros.
   * - "none":          nothing usable was entered (all-zero breakdown).
   */
  mode: "from-calories" | "from-macros" | "none";
}

/** The raw field values, straight from the inputs. */
export interface MacroInput {
  calories?: string | number;
  protein?: string | number;
  carbs?: string | number;
  fat?: string | number;
}

/** Energy per gram of each macronutrient (kcal/g). */
const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

/**
 * Predefined calorie split used when calories drive the suggestion.
 * 25% protein / 45% carbs / 30% fat. Must sum to 1.
 */
const MACRO_CALORIE_RATIOS = {
  protein: 0.25,
  carbs: 0.45,
  fat: 0.3,
} as const;

/** Round to at most one decimal place to keep suggestions readable. */
const round = (value: number): number =>
  Number.isFinite(value) ? Math.round(value * 10) / 10 : 0;

/** Parse a raw input string/number into a non-negative number (0 if invalid). */
const toNumber = (value: string | number | undefined): number => {
  const parsed = typeof value === "number" ? value : parseFloat(value ?? "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

/**
 * Build a full breakdown from a known total calorie target using the
 * predefined ratios.
 *
 * @example
 * breakdownFromCalories(2400); // → protein 150, carbs 270, fat 80
 */
const breakdownFromCalories = (
  calories: number,
): Omit<MacroSuggestion, "mode"> => ({
  calories: round(calories),
  protein: round(
    (calories * MACRO_CALORIE_RATIOS.protein) / CALORIES_PER_GRAM.protein,
  ),
  carbs: round(
    (calories * MACRO_CALORIE_RATIOS.carbs) / CALORIES_PER_GRAM.carbs,
  ),
  fat: round((calories * MACRO_CALORIE_RATIOS.fat) / CALORIES_PER_GRAM.fat),
});

/**
 * Calculate total calories from any combination of entered macros using the
 * exact energy formula: Calories = (Protein × 4) + (Carbs × 4) + (Fat × 9).
 * Missing/invalid macros are treated as 0.
 *
 * @example
 * calculateCaloriesFromMacros({ protein: 150, carbs: 270, fat: 80 }); // → 2400
 */
export const calculateCaloriesFromMacros = (macros: {
  protein?: string | number;
  carbs?: string | number;
  fat?: string | number;
}): number => {
  const protein = toNumber(macros.protein);
  const carbs = toNumber(macros.carbs);
  const fat = toNumber(macros.fat);

  return round(
    protein * CALORIES_PER_GRAM.protein +
      carbs * CALORIES_PER_GRAM.carbs +
      fat * CALORIES_PER_GRAM.fat,
  );
};

/* -------------------------------------------------------------------------- */
/*  Whole-gram solver                                                         */
/* -------------------------------------------------------------------------- */

/**
 * A macro split expressed in grams. Only the proportions matter — any positive
 * multiple of the same three numbers describes the same split.
 */
export interface MacroRatio {
  protein: number;
  carbs: number;
  fat: number;
}

/** A breakdown in whole grams. Every field is a non-negative integer. */
export interface WholeGramMacros {
  protein: number;
  carbs: number;
  fat: number;
  /**
   * P×4 + C×4 + F×9 for the grams above. Equals the requested calorie total
   * whenever whole grams can hit it exactly — which is every whole number of
   * calories from 27 up, plus every multiple of 4 below it.
   */
  calories: number;
}

/**
 * The default 25% protein / 45% carbs / 30% fat split, written as the grams
 * that make up exactly 1 kcal. Used whenever there is no per-item ratio to
 * preserve.
 */
export const DEFAULT_MACRO_RATIO: MacroRatio = {
  protein: MACRO_CALORIE_RATIOS.protein / CALORIES_PER_GRAM.protein,
  carbs: MACRO_CALORIE_RATIOS.carbs / CALORIES_PER_GRAM.carbs,
  fat: MACRO_CALORIE_RATIOS.fat / CALORIES_PER_GRAM.fat,
};

const ZERO_WHOLE_GRAM_MACROS: WholeGramMacros = {
  protein: 0,
  carbs: 0,
  fat: 0,
  calories: 0,
};

/**
 * Split a calorie total into WHOLE GRAMS of protein, carbs and fat that follow
 * `ratio` as closely as possible. Never returns fractions.
 *
 * Two goals, in strict priority order:
 *   1. P×4 + C×4 + F×9 must equal `calories` exactly, so the macros always
 *      reconcile with the number the user typed.
 *   2. Among the breakdowns that satisfy (1), pick the one sitting closest to
 *      the requested ratio.
 *
 * How it works: protein and carbs are both 4 kcal/g, so together they can only
 * ever contribute multiples of 4. Fat, at 9 kcal/g, is the single lever that
 * moves the total off a multiple of 4 — an exact sum therefore needs
 * `fat ≡ calories (mod 4)`. Scanning ±6 g around the ideal fat figure always
 * covers all four residues (or the entire feasible range, when that is
 * shorter), so an exact solution is never missed when one exists. The calories
 * left after fat are then divided between protein and carbs at their own
 * ratio, which lands on whole grams by construction.
 *
 * Totals that whole grams cannot express — decimals like 1000.5, and the
 * handful of small values below 27 kcal such as 10 or 23 — fall back to the
 * closest achievable sum rather than reintroducing fractions.
 *
 * @example
 * solveWholeGramMacros(1000);
 * // → { protein: 64, carbs: 114, fat: 32, calories: 1000 }
 *
 * @example
 * // Preserving an item's own ratio instead of the default split:
 * solveWholeGramMacros(1000, { protein: 20, carbs: 30, fat: 10 });
 * // → { protein: 68, carbs: 101, fat: 36, calories: 1000 }
 */
export const solveWholeGramMacros = (
  calories: number,
  ratio: MacroRatio = DEFAULT_MACRO_RATIO,
): WholeGramMacros => {
  if (!Number.isFinite(calories) || calories <= 0) {
    return ZERO_WHOLE_GRAM_MACROS;
  }

  const ratioCalories =
    ratio.protein * CALORIES_PER_GRAM.protein +
    ratio.carbs * CALORIES_PER_GRAM.carbs +
    ratio.fat * CALORIES_PER_GRAM.fat;
  if (!(ratioCalories > 0)) {
    return ZERO_WHOLE_GRAM_MACROS;
  }

  // The exact, unrounded grams this calorie total works out to.
  const scale = calories / ratioCalories;
  const idealProtein = ratio.protein * scale;
  const idealCarbs = ratio.carbs * scale;
  const idealFat = ratio.fat * scale;

  const proteinShare =
    idealProtein + idealCarbs > 0
      ? idealProtein / (idealProtein + idealCarbs)
      : 0;

  const maxFat = Math.floor(calories / CALORIES_PER_GRAM.fat);
  const from = Math.max(0, Math.min(maxFat, Math.floor(idealFat) - 6));
  const to = Math.min(maxFat, Math.ceil(idealFat) + 6);

  let best: WholeGramMacros | null = null;
  let bestError = Infinity;
  let bestDrift = Infinity;

  for (let fat = from; fat <= to; fat++) {
    const forProteinAndCarbs = calories - fat * CALORIES_PER_GRAM.fat;
    if (forProteinAndCarbs < 0) {
      continue;
    }

    // Protein and carbs cost the same per gram, so they draw on one shared
    // gram budget that is then split at their own ratio.
    const budget = Math.max(
      0,
      Math.round(forProteinAndCarbs / CALORIES_PER_GRAM.protein),
    );
    const protein = Math.min(
      budget,
      Math.max(0, Math.round(budget * proteinShare)),
    );
    const carbs = budget - protein;

    const total =
      protein * CALORIES_PER_GRAM.protein +
      carbs * CALORIES_PER_GRAM.carbs +
      fat * CALORIES_PER_GRAM.fat;
    const error = Math.abs(total - calories);
    // Squared drift, so the tie-break between exact solutions prefers the one
    // spreading its error evenly rather than dumping it all on one macro.
    const drift =
      (protein - idealProtein) ** 2 +
      (carbs - idealCarbs) ** 2 +
      (fat - idealFat) ** 2;

    if (
      error < bestError - 1e-9 ||
      (error < bestError + 1e-9 && drift < bestDrift)
    ) {
      best = { protein, carbs, fat, calories: total };
      bestError = error;
      bestDrift = drift;
    }
  }

  return best ?? ZERO_WHOLE_GRAM_MACROS;
};

/**
 * Generate a complete macro breakdown from the current field values.
 *
 * Calories always take priority: if a calorie value is present, protein, carbs,
 * and fat are regenerated from the predefined ratios and any macros the user
 * already typed are ignored. Only when calories are empty are they derived from
 * the entered macros.
 *
 * Safe to call on every keystroke — it is pure and returns an all-zero
 * breakdown (mode "none") when nothing usable is entered.
 *
 * @example
 * // Calories entered → macros suggested from ratios (macros ignored):
 * generateMacroSuggestions({ calories: 2400, protein: 999 });
 * // → { calories: 2400, protein: 150, carbs: 270, fat: 80, mode: "from-calories" }
 *
 * @example
 * // No calories → calories derived from macros:
 * generateMacroSuggestions({ protein: 150, carbs: 270, fat: 80 });
 * // → { calories: 2400, protein: 150, carbs: 270, fat: 80, mode: "from-macros" }
 */
export const generateMacroSuggestions = (
  input: MacroInput,
): MacroSuggestion => {
  const calories = toNumber(input.calories);

  // Mode 1: calories entered → they take priority, always.
  if (calories > 0) {
    return { ...breakdownFromCalories(calories), mode: "from-calories" };
  }

  // Mode 2: no calories → derive them from whatever macros are entered.
  const protein = toNumber(input.protein);
  const carbs = toNumber(input.carbs);
  const fat = toNumber(input.fat);
  const derivedCalories = calculateCaloriesFromMacros({ protein, carbs, fat });

  if (derivedCalories > 0) {
    return {
      calories: derivedCalories,
      protein: round(protein),
      carbs: round(carbs),
      fat: round(fat),
      mode: "from-macros",
    };
  }

  // Nothing usable entered yet.
  return { calories: 0, protein: 0, carbs: 0, fat: 0, mode: "none" };
};

/* -------------------------------------------------------------------------- */
/*  Live recommendations driven by the user's body profile                    */
/* -------------------------------------------------------------------------- */

/** Conversion factor from pounds to kilograms. */
const LB_TO_KG = 0.45359237;

/**
 * Protein target per kilogram of body weight, keyed by gender.
 * - Men:   2.0 g/kg
 * - Women: 1.5 g/kg
 * Anything we can't confidently read as male falls back to the female rate,
 * which is the more conservative (lower) target.
 */
const PROTEIN_PER_KG = {
  male: 2,
  female: 1.5,
} as const;

/**
 * How the calories left after protein are split.
 * 60% of the remaining calories go to carbs, 40% to fat. Must sum to 1.
 */
const REMAINING_CALORIE_SPLIT = {
  carbs: 0.6,
  fat: 0.4,
} as const;

/** The subset of user profile fields this engine needs. */
export interface UserProfile {
  gender?: string | null;
  weight?: string | number | null;
  weight_unit?: string | null;
}

/** Result of a live recommendation. Grams for macros, kcal for calories. */
export interface MacroRecommendation {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  /**
   * Which mode produced the result:
   * - "from-calories": calories were the source of truth; macros derived from them.
   * - "from-macros":   no calories entered; calories derived from the macros.
   * - "none":          nothing usable was available.
   */
  mode: "from-calories" | "from-macros" | "none";
  /**
   * True when the protein figure came from the user's body weight/gender rather
   * than a value they typed. Lets the UI label it as an estimate.
   */
  proteinFromBodyWeight: boolean;
}

/** Optional tuning for {@link generateLiveMacroRecommendations}. */
export interface LiveRecommendationOptions {
  /**
   * When true, protein is always estimated from the user's body weight/gender
   * (2 g/kg men, 1.5 g/kg women), even if they've already entered a protein
   * value. Carbs and fat are then derived from that estimate too, so the whole
   * breakdown stays a self-consistent "ideal" target the user can compare
   * against and tap to apply. Defaults to false, where a manually entered
   * protein wins. If no body profile is available to estimate from, the entered
   * protein is used as a fallback regardless of this flag.
   */
  alwaysEstimateProtein?: boolean;
}

/**
 * Whether a stored `weight_unit` means pounds. Forgiving on purpose: anything
 * that looks like pounds ("lb", "lbs", "pound") counts; everything else is
 * treated as kilograms.
 *
 * Exported so callers can skip a kg profile's conversions entirely rather than
 * relying on them being no-ops.
 */
export const isPoundsUnit = (
  weightUnit: string | null | undefined,
): boolean => {
  const unit = (weightUnit ?? "").toString().trim().toLowerCase();
  return unit.startsWith("lb") || unit.includes("pound");
};

/**
 * Normalize a stored body weight to kilograms, handling both `kg` and `lb`
 * units. Returns 0 when the weight is missing or invalid.
 *
 * The inverse of {@link convertKgToWeightUnit}: use it wherever a number that
 * is interpreted through `weight_unit` (`user.weight`, a logged statistics
 * weight) has to be read as kilograms.
 */
export const getWeightInKg = (
  weight: string | number | null | undefined,
  weightUnit: string | null | undefined,
): number => {
  const kg = toNumber(weight ?? undefined);
  if (kg <= 0) {
    return 0;
  }

  return isPoundsUnit(weightUnit) ? kg * LB_TO_KG : kg;
};

/**
 * Convert a kilogram reading into the unit a profile stores its weight in.
 * The exact inverse of {@link getWeightInKg}.
 *
 * Needed when a kg-based source (the Statistics input, Apple Health, Health
 * Connect) is written back to `user.weight`: that field is interpreted through
 * `user.weight_unit`, so a raw kg number saved against a `lb` profile would
 * read back ~2.2x too low. Returns 0 for anything unusable.
 */
export const convertKgToWeightUnit = (
  weightKg: number,
  weightUnit: string | null | undefined,
): number => {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return 0;
  }

  return isPoundsUnit(weightUnit) ? weightKg / LB_TO_KG : weightKg;
};

/**
 * Estimate a daily protein target (grams) from the user's body weight and
 * gender, using 2 g/kg for men and 1.5 g/kg for women. Returns 0 when there
 * isn't enough profile data to compute it.
 */
const estimateProteinFromBody = (user: UserProfile | undefined): number => {
  if (!user) {
    return 0;
  }

  const weightKg = getWeightInKg(user.weight, user.weight_unit);
  if (weightKg <= 0) {
    return 0;
  }

  const gender = (user.gender ?? "").toString().trim().toLowerCase();
  const isMale = gender === "male" || gender === "m" || gender === "man";
  const perKg = isMale ? PROTEIN_PER_KG.male : PROTEIN_PER_KG.female;

  return weightKg * perKg;
};

/**
 * Generate live macro recommendations, prioritising calories as the source of
 * truth and adapting the protein target to the user's body profile.
 *
 * ── Mode 1 — calories entered (highest priority) ──────────────────────────
 *   1. Protein: use the user's manually entered protein when present; otherwise
 *      estimate it from body weight × gender (2 g/kg men, 1.5 g/kg women, with
 *      `lb` weights converted to kg first).
 *   2. proteinCalories = protein × 4, subtracted from the total calories.
 *   3. Remaining calories are split 60% carbs / 40% fat, then converted back to
 *      grams: carbs = carbCalories / 4, fat = fatCalories / 9.
 *
 * ── Mode 2 — no calories ──────────────────────────────────────────────────
 *   Calories are derived from whatever macros were entered:
 *   Calories = (Protein × 4) + (Carbs × 4) + (Fat × 9).
 *
 * The function is pure and cheap, so it is safe to call on every keystroke to
 * keep the suggestion section updating live as the user types.
 *
 * Edge cases handled: missing/invalid user profile, zero or invalid inputs,
 * `kg` vs `lb` weight units, protein whose calories alone meet or exceed the
 * entered calories (treated as invalid — returns an all-zero breakdown so the
 * UI shows no suggestion instead of fabricated numbers), and rounding to one
 * decimal place.
 *
 * @param input   The current calorie/macro field values from the form.
 * @param user    The user's body profile (gender, weight, weight_unit).
 * @param options Optional tuning; pass `{ alwaysEstimateProtein: true }` to
 *                always show a body-weight protein target even after the user
 *                has typed their own value (see {@link LiveRecommendationOptions}).
 *
 * @example
 * // Male, 80 kg, 2000 kcal, no protein typed → protein estimated at 160 g.
 * generateLiveMacroRecommendations(
 *   { calories: 2000 },
 *   { gender: "male", weight: 80, weight_unit: "kg" },
 * );
 * // → protein 160, proteinCalories 640, remaining 1360
 * //   carbs = (1360 × 0.6) / 4 = 204, fat = (1360 × 0.4) / 9 ≈ 60.4
 *
 * @example
 * // Manually entered protein always wins over the body-weight estimate:
 * generateLiveMacroRecommendations(
 *   { calories: 2000, protein: 120 },
 *   { gender: "male", weight: 80, weight_unit: "kg" },
 * );
 * // → protein 120 (proteinFromBodyWeight: false)
 */
export const generateLiveMacroRecommendations = (
  input: MacroInput,
  user?: UserProfile,
  options: LiveRecommendationOptions = {},
): MacroRecommendation => {
  const calories = toNumber(input.calories);

  // ── Mode 1: calories are the source of truth. ──────────────────────────
  if (calories > 0) {
    const enteredProtein = toNumber(input.protein);
    const estimatedProtein = estimateProteinFromBody(user);

    // Prefer the body-weight estimate when asked to (or when no protein was
    // entered), but only if we can actually compute one — otherwise fall back
    // to the entered value so carbs/fat still derive from a real number.
    const preferEstimate = options.alwaysEstimateProtein || enteredProtein <= 0;
    const proteinFromBodyWeight = preferEstimate && estimatedProtein > 0;
    const protein = proteinFromBodyWeight ? estimatedProtein : enteredProtein;

    const proteinCalories = protein * CALORIES_PER_GRAM.protein;
    const remainingCalories = calories - proteinCalories;

    // Invalid / insufficient budget: the protein target alone already meets or
    // exceeds the entered calories (e.g. an unrealistically low calorie value
    // like 90 kcal against a body-weight protein target). There is no sensible
    // macro split to offer, so return an all-zero breakdown and let the UI show
    // no suggestion rather than fabricated numbers.
    if (remainingCalories <= 0) {
      return {
        calories: round(calories),
        protein: 0,
        carbs: 0,
        fat: 0,
        mode: "none",
        proteinFromBodyWeight: false,
      };
    }

    const carbs =
      (remainingCalories * REMAINING_CALORIE_SPLIT.carbs) /
      CALORIES_PER_GRAM.carbs;
    const fat =
      (remainingCalories * REMAINING_CALORIE_SPLIT.fat) / CALORIES_PER_GRAM.fat;

    return {
      calories: round(calories),
      protein: round(protein),
      carbs: round(carbs),
      fat: round(fat),
      mode: "from-calories",
      proteinFromBodyWeight,
    };
  }

  // ── Mode 2: no calories → derive them from the entered macros. ─────────
  const protein = toNumber(input.protein);
  const carbs = toNumber(input.carbs);
  const fat = toNumber(input.fat);
  const derivedCalories = calculateCaloriesFromMacros({ protein, carbs, fat });

  if (derivedCalories > 0) {
    return {
      calories: derivedCalories,
      protein: round(protein),
      carbs: round(carbs),
      fat: round(fat),
      mode: "from-macros",
      proteinFromBodyWeight: false,
    };
  }

  // Nothing usable entered yet.
  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    mode: "none",
    proteinFromBodyWeight: false,
  };
};

export default generateMacroSuggestions;
