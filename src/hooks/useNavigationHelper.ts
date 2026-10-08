import * as React from "react";
import { NavigationContainerRef } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/native";

export const navigationRef =
  React.createRef<NavigationContainerRef<ParamListBase>>();

const useNavigationHelper = () => {
  const navigate = (name: string, params?: ParamListBase) => {
    navigationRef.current?.navigate(name, params);
  };

  const goBack = () => {
    if (navigationRef.current?.canGoBack()) {
      navigationRef.current.goBack();
    }
  };

  const navigateWithReset = (name: string, params?: ParamListBase) => {
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name, params }],
    });
  };

  return {
    navigate,
    goBack,
    navigateWithReset,
  };
};

export default useNavigationHelper;
