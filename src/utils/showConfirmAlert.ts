import { Alert } from "react-native";

type ConfirmOptions = {
  title?: string;
  tagLine?: string;
  handleOnDone: () => void;
  handleOnCancel?: () => void;
  buttonTitle?: string;
  noButtonTitle?: string;
  isDestructive?: boolean;
  hasCancel?: boolean;
};

export const showConfirmAlert = ({
  title = "Confirm",
  tagLine = "Are you sure?",
  handleOnDone,
  handleOnCancel,
  buttonTitle = "Yes",
  noButtonTitle = "Cancel",
  isDestructive = true,
  hasCancel = true,
}: ConfirmOptions) => {
  Alert.alert(
    title,
    tagLine,
    hasCancel
      ? [
          {
            text: noButtonTitle,
            style: "cancel",
            onPress: handleOnCancel,
          },
          {
            text: buttonTitle,
            style: isDestructive ? "destructive" : "default",
            onPress: handleOnDone,
          },
        ]
      : [
          {
            text: buttonTitle,
            style: isDestructive ? "destructive" : "default",
            onPress: handleOnDone,
          },
        ],
  );
};
