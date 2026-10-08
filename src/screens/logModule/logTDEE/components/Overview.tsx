import { View, Text, Image } from "react-native";
import React, { memo } from "react";
import styles from "../styles";
import ICONS from "../../../../assets/icons";
import { COLORS } from "../../../../macros/colors";
import { useGetDietSuggessionsQuery } from "../../../../services/logsTDEEServices";
import LoadingIndicator from "../../../../components/loaders/LoadingIndicator";
import { useSelector } from "react-redux";
import { RootState } from "../../../../states/store/store";
import AppText from "../../../../components/appText";

const Overview = ({
  isMessageProcessingCompleted,
}: {
  isMessageProcessingCompleted: boolean;
}) => {
  const logTDEEFilter = useSelector(
    (state: RootState) => state.filtersReducer?.logTDEEFilter,
  );

  const { data, isFetching } = useGetDietSuggessionsQuery(
    { date: logTDEEFilter, autoRefetch: isMessageProcessingCompleted },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  return (
    <View style={styles.container}>
      <AppText allowFontScaling={false} style={styles.headingText}>
        Overview
      </AppText>
      <View style={styles.view}>
        {isFetching && <LoadingIndicator color={COLORS.HEADING} />}

        <View style={styles.viewScroll}>
          {data?.suggestions ? (
            data?.suggestions?.map((item: any) => {
              return (
                <View key={item?.id} style={styles.itemView}>
                  <Image
                    source={ICONS.checkCircle}
                    style={styles.iconImg}
                    tintColor={COLORS.ICON_COLOR}
                  />
                  <View style={styles.textRightView}>
                    <AppText allowFontScaling={false} style={styles.desText}>
                      {item?.description}
                    </AppText>
                  </View>
                </View>
              );
            })
          ) : (
            <AppText allowFontScaling={false} style={styles.desText}>
              Let's get this party started! Log a meal to make use of this
              feature!
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(Overview);
