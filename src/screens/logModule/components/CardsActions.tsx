import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import ICONS from "../../../assets/icons";
import {
  useDeleteLogsMutation,
  useRemoveQuickItemMutation,
} from "../../../services/logsTDEEServices";
import { getError } from "../../../utils/errors";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { RootNavigationProp, TDEEHistoryProps } from "../../../schemas/types";
import ConfirmationAlert from "../../../components/customModals/ConfirmationAlert";
import { showConfirmAlert } from "../../../utils/showConfirmAlert";
import { setScreenFromLogHistory } from "../../../states/reducer/cameraReducer";
import { screens } from "../../../navigations/routes";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  item: TDEEHistoryProps;
  isHistory?: boolean;
  handlePressOnEdit?: any;
  handlePressOnAdd?: any;
};

type IconActionProps = {
  icon: ImageSourcePropType;
  label: string;
  tint: string;
  bg: string;
  onPress: () => void;
};

const IconAction = ({ icon, label, tint, bg, onPress }: IconActionProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    hitSlop={6}
    onPress={onPress}
    style={({ pressed }) => [
      styles.iconAction,
      { backgroundColor: bg },
      pressed && styles.actionPressed,
    ]}
  >
    <Image source={icon} style={styles.iconActionImg} tintColor={tint} />
  </Pressable>
);

const CardsActions = ({
  item,
  isHistory,
  handlePressOnEdit,
  handlePressOnAdd,
}: Props) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavigationProp>();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [deleteHistory] = useDeleteLogsMutation();
  const [removeQuickItem] = useRemoveQuickItemMutation();

  // History entries delete the log; Saved Meals entries only drop the saved
  // meal, so past logs made from it stay in history.
  const confirmCopy = isHistory
    ? {
        title: "Delete Item",
        tagLine:
          "Are you sure you want to delete this entry from your history?",
      }
    : {
        title: "Remove saved meal",
        tagLine:
          "Remove this meal from Saved Meals? Meals you already logged stay in your history.",
      };

  const handleOnPressDeleteCard = () => {
    if (Platform.OS === "ios") {
      showConfirmAlert({
        ...confirmCopy,
        buttonTitle: "Delete",
        handleOnDone: handleOnDone,
      });
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const handleOnDone = () => {
    setIsConfirmModalOpen(false);
    if (isHistory) {
      handleDeleteHistory();
    } else {
      handleRemoveQuickItem();
    }
  };

  const handleRemoveQuickItem = () => {
    if (!item?.id) return;
    removeQuickItem({ logId: item?.id })
      .unwrap()
      .then(() => {
        successAlert({ body: "Removed from Saved Meals" });
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleDeleteHistory = useCallback(() => {
    if (!item?.id) return;
    deleteHistory({ logId: item?.id })
      .then(() => {
        successAlert({
          body: "This item has been removed from history",
        });
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  }, []);

  const handleOnCloseInfoModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleOnPressCamera = useCallback(() => {
    if (!item?.id) return;

    dispatch(setScreenFromLogHistory(item?.id));
    navigation.navigate(screens.MAIN_SCREEN_STACK, {
      screen: screens.BOTTOM_TAB_STACK,
    });
  }, []);

  return (
    <>
      <View style={[styles.actionRow, { borderTopColor: colors.BORDER_COLOR }]}>
        {/* Every row keeps its tools on the right edge. */}
        <View style={styles.actionSpacer} />
        <IconAction
          icon={ICONS.delete2}
          label={isHistory ? "Delete" : "Remove from Saved Meals"}
          tint={colors.RED}
          bg={colors.RED_TRANSPARENT}
          onPress={handleOnPressDeleteCard}
        />
        <IconAction
          icon={ICONS.edit2}
          label="Edit"
          tint={colors.HEADING}
          bg={colors.BACKGROUND}
          onPress={() => handlePressOnEdit(item)}
        />
        {isHistory && (
          <IconAction
            icon={ICONS.camera2}
            label="Adjust with photo"
            tint={colors.HEADING}
            bg={colors.BACKGROUND}
            onPress={handleOnPressCamera}
          />
        )}
        {!isHistory && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Log ${item?.name ?? "meal"}`}
            onPress={() => handlePressOnAdd(item)}
            style={({ pressed }) => [
              styles.logButton,
              { backgroundColor: colors.PRIMARY, shadowColor: colors.PRIMARY },
              pressed && styles.actionPressed,
            ]}
          >
            <Image
              source={ICONS.plus2}
              style={styles.logIcon}
              tintColor={colors.ON_PRIMARY}
            />
            <AppText
              allowFontScaling={false}
              style={[styles.logText, { color: colors.ON_PRIMARY }]}
            >
              Log
            </AppText>
          </Pressable>
        )}
      </View>
      <ConfirmationAlert
        isModalOpen={isConfirmModalOpen}
        title={confirmCopy.title}
        tagLine={confirmCopy.tagLine}
        buttonTitle="Delete"
        handleOnClose={handleOnCloseInfoModal}
        handleOnDone={handleOnDone}
      />
    </>
  );
};

export default CardsActions;
