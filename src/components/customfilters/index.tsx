import React, { useCallback, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBottomSheet from "../customBottomSheet";
import FilterList from "./FilterList";
import { FILTER_DATA } from "../../data/staticData";
import { FilterProps } from "../../schemas/types";

const CustomFilters = ({
  filterSheetRef,
  handleSearchFilter,
  filterData = FILTER_DATA,
  type = "",
  currentValue = "",
  title,
}: {
  filterSheetRef: React.RefObject<BottomSheetModal>;
  handleSearchFilter: (searchType: string, text: string) => void;
  filterData?: any;
  type?: string;
  currentValue?: string;
  /** Sheet heading. Defaults to "Show data for" for date filters. */
  title?: string;
}) => {
  const [sheetKey, setSheetKey] = useState(0);

  const handleCloseBottomSheet = useCallback(() => {
    filterSheetRef?.current?.close();
  }, [filterSheetRef]);

  // Remount the sheet once it is fully closed, no matter how it got closed
  // (option press, backdrop press or drag down) so it opens cleanly again.
  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setSheetKey(prev => prev - 1);
    }
  }, []);

  // Selecting an option saves it and closes the sheet, there is no save button
  const handleSelectFilter = useCallback(
    (item: FilterProps) => {
      if (item?.id) {
        handleSearchFilter("filter", item?.id);
      }
      handleCloseBottomSheet();
    },
    [handleSearchFilter, handleCloseBottomSheet],
  );

  return (
    <CustomBottomSheet
      key={sheetKey}
      bottomSheetRef={filterSheetRef}
      isBackDrop={true}
      enableDrag={false}
      enablePanDownClose={true}
      backdropPressBehavior="close"
      onSheetChange={handleSheetChange}
      customSanps={["50%"]}
    >
      <FilterList
        handleSelectFilter={handleSelectFilter}
        filterData={filterData}
        type={type}
        currentValue={currentValue}
        title={title}
      />
    </CustomBottomSheet>
  );
};

export default CustomFilters;
