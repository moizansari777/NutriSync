import { NativeModules } from "react-native";

const { WidgetManager } = NativeModules;

export const updateMacrosWidget = (data: any) => {
  if (!WidgetManager) {
    console.warn("WidgetManager native module not linked");
    return;
  }

  WidgetManager.updateWidget(data);
};
