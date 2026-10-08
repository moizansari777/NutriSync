import Share from "react-native-share";

type Props = {
  message?: string;
  url?: string;
  title?: string;
  type?: string;
};

export const shareService = async (props: Props): Promise<void> => {
  try {
    const options: any = {
      title: props?.title || "NutriSync",
      url: props?.url,
      failOnCancel: false,
      useInternalStorage: true, // Required for Android API 30+c
    };

    if (props?.message) {
      options.message = props?.message;
    }
    if (props?.type) {
      options.type = props.type;
    }

    const result = await Share.open(options);
    // console.log("Shared successfully:", result);
  } catch (error: any) {
    if (error?.message !== "User did not share") {
      console.warn("Share error:");
    }
  }
};
