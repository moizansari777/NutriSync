"use no memo";
import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { AndroidMacrosWidgetView } from "./AndroidMacrosWidgetView";
import { storage } from "../../utils/storage";
import {
  WIDGET_DEFAULT_PAYLOAD,
  WIDGET_STORAGE_KEY,
  WidgetPayload,
} from "../../data/widgetDefaultData";
import { Macro } from "../../schemas/types";

const nameToWidget = {
  // Macro will be the **name** with which we will reference our widget.
  Macro: AndroidMacrosWidgetView,
};

/**
 * Older builds stored a bare Macro[] under this key; normalise both shapes so an
 * upgrade doesn't render an empty widget.
 */
const readPayload = async (): Promise<WidgetPayload> => {
  const stored = await storage.get<WidgetPayload | Macro[]>(
    WIDGET_STORAGE_KEY,
    WIDGET_DEFAULT_PAYLOAD,
  );

  if (Array.isArray(stored)) {
    return { macrosData: stored, scheme: WIDGET_DEFAULT_PAYLOAD.scheme };
  }

  return {
    macrosData: stored?.macrosData ?? WIDGET_DEFAULT_PAYLOAD.macrosData,
    scheme: stored?.scheme ?? WIDGET_DEFAULT_PAYLOAD.scheme,
  };
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  if (!Widget) return;

  switch (props.widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED": {
      try {
        const { macrosData, scheme } = await readPayload();

        props.renderWidget(<Widget macrosData={macrosData} scheme={scheme} />);
      } catch {
        // Never leave the widget blank — fall back to the default payload.
        props.renderWidget(
          <Widget
            macrosData={WIDGET_DEFAULT_PAYLOAD.macrosData}
            scheme={WIDGET_DEFAULT_PAYLOAD.scheme}
          />,
        );
      }
      break;
    }

    case "WIDGET_DELETED":
      await storage.remove(WIDGET_STORAGE_KEY);
      break;

    default:
      break;
  }
}
