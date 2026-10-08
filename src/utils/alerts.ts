import { ALERT_TYPE, Toast } from "react-native-alert-notification";

export const successAlert = ({
  title,
  body,
}: {
  title?: string;
  body: string;
}) => {
  Toast.show({
    type: ALERT_TYPE.SUCCESS,
    title: title || "Success",
    textBody: body || "Successfully Done",
    autoClose: true,
  });
};

export const errorAlert = ({
  title,
  body,
}: {
  title?: string;
  body: string;
}) => {
  Toast.show({
    type: ALERT_TYPE.DANGER,
    title: title || "Error",
    textBody: body || "Something went wrong",
    autoClose: true,
  });
};
