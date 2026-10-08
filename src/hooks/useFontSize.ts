import { useSelector } from "react-redux";
import { RootState } from "../states/store/store";
import { useMemo } from "react";
import { ResponsiveValue, wps } from "../utils/responsiveSize";

export const useFontSize = () => {
  // reactive subscription instead of store.getState()
  const scale = useSelector(
    (state: RootState) => state.settingReducer.textScaleValue
  );

  return useMemo(() => {
    return (value: ResponsiveValue): number => {
      const base = typeof value === "string" && value.includes("%")
        ? wps(parseFloat(value))
        : wps(value);

      return base * (scale ?? 1);
    };
  }, [scale]);
};