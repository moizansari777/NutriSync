import React, { FC, useCallback, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RootStackParamList, screens } from "../../../../navigations/routes";
import ScreenWrapper from "../../../../components/screenWrapper";
import ClientList from "./components/ClientsList";
import { RootState } from "../../../../states/store/store";
import { setCoachFilter } from "../../../../states/reducer/filtersReducer";
import { CoachFilterKey, TDEE_FILTER_DATA } from "../../../../data/staticData";
import CustomFilters from "../../../../components/customfilters";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.CLIENT_COACH_SCREEN
>;

const ClientsCoach: FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const filterSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );
  const coachClientFilter = useSelector(
    (state: RootState) =>
      state.filtersReducer?.coachClientFilter ?? "last_7_days",
  );

  const handleOpenFilterSheet = useCallback(() => {
    setTimeout(() => {
      filterSheetRef.current?.present();
    }, 0);
  }, []);

  const handleSearch = useCallback((searchType: string, value: string) => {
    dispatch(
      setCoachFilter({
        key: CoachFilterKey.coachClientFilter,
        value: value,
      }),
    );
  }, []);

  return (
    <ScreenWrapper
      isBack={true}
      hasTitle={true}
      title="Clients Coach"
      hasRefresh={false}
      hasFilter={true}
      onPressOnFilter={handleOpenFilterSheet}
    >
      <ClientList coachClientFilter={coachClientFilter} />

      <CustomFilters
        filterSheetRef={filterSheetRef}
        handleSearchFilter={handleSearch}
        filterData={TDEE_FILTER_DATA}
        type="logs"
        currentValue={coachClientFilter}
      />
    </ScreenWrapper>
  );
};

export default ClientsCoach;
