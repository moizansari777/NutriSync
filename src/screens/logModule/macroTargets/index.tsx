import { Keyboard } from "react-native";
import React, { FC, useCallback, useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../../navigations/routes";
import CalculationTDEE from "../calculationTDEE";
import AddCustomMacros from "../addCustomMacros";
import MacroModeToggle, { MacroMode } from "./components/MacroModeToggle";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.TDEE_CALCULATION_SCREEN | screens.ADD_CUSTOM_MACROS_SCREEN
>;

type TDEEParams = RootStackParamList[screens.TDEE_CALCULATION_SCREEN];

// The custom-macros entry point carries no params of its own, so the auto
// (TDEE) side gets exactly what the in-app "Calculate TDEE" button used to
// pass — otherwise the TDEE form would skip its prefill and show "Login".
const TDEE_PARAMS_FROM_LOGS: TDEEParams = {
  hasBack: true,
  showLogin: "no",
  from: "logs",
};

// Shared header title while both modes are reachable. When the toggle is
// hidden (onboarding), each flow keeps its own original title.
const MACRO_TARGETS_TITLE = "";

/**
 * Single entry point for both ways of setting daily targets:
 *   • "Auto Calculate" → the TDEE calculator (default)
 *   • "Custom Targets" → manual macro targets
 *
 * Both flows stay fully self-contained — they keep their own header, form,
 * validation and API calls. This screen only owns the toggle and decides which
 * one is on screen, so exactly one of them is ever mounted.
 */
const MacroTargets: FC<Props> = ({ route }) => {
  const openedFromTDEE = route?.name === screens.TDEE_CALCULATION_SCREEN;

  const tdeeParams = useMemo<TDEEParams>(
    () =>
      openedFromTDEE
        ? (route?.params as TDEEParams) ?? {}
        : TDEE_PARAMS_FROM_LOGS,
    [openedFromTDEE, route?.params],
  );

  // Onboarding / pre-login only calculates a TDEE. Custom targets need a
  // logged-in account, so the toggle is not offered there.
  const canSetCustomMacros = tdeeParams?.showLogin === "no";

  const [selectedMode, setSelectedMode] = useState<MacroMode>("auto");

  const handleSelectMode = useCallback((mode: MacroMode) => {
    Keyboard.dismiss();
    setSelectedMode(mode);
  }, []);

  const renderToggle = useMemo(
    () =>
      canSetCustomMacros ? (
        <MacroModeToggle
          selectedMode={selectedMode}
          handleSelectMode={handleSelectMode}
        />
      ) : null,
    [canSetCustomMacros, selectedMode, handleSelectMode],
  );

  // `undefined` lets each flow fall back to the title it has always used.
  const title = canSetCustomMacros ? MACRO_TARGETS_TITLE : undefined;

  if (canSetCustomMacros && selectedMode === "manual") {
    return <AddCustomMacros title={title} renderToggle={renderToggle} />;
  }

  return (
    <CalculationTDEE
      params={tdeeParams}
      title={title}
      renderToggle={renderToggle}
    />
  );
};

export default MacroTargets;
