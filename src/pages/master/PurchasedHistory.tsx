import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { fetchPoHistoryAsync } from "@/features/master/componentPercentage/componentPercentageSlice";
import { PoHistoryFilterType } from "@/features/master/componentPercentage/componentPercentageType";
import PoHistoryFilters from "./purchasedHistory/PoHistoryFilters";
import PoHistoryGrid from "./purchasedHistory/PoHistoryGrid";
import { ComponentOption, VendorOption } from "./purchasedHistory/poHistory.api";

const PurchasedHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { poHistoryData, poHistoryType, poHistoryLoading } = useAppSelector(
    (state) => state.componentPercentage,
  );

  const [filterType, setFilterType] = useState<PoHistoryFilterType>("component");
  const [selectedComponents, setSelectedComponents] = useState<ComponentOption[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<VendorOption[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const showComponentField = filterType === "component" || filterType === "both";
  const showVendorField = filterType === "vendor" || filterType === "both";

  const groups = useMemo(() => poHistoryData ?? [], [poHistoryData]);

  const gridMode: PoHistoryFilterType = useMemo(() => {
    if (poHistoryType === "vendor" || poHistoryType === "component") return poHistoryType;
    return groups[0]?.vendor && !groups[0]?.component ? "vendor" : "component";
  }, [poHistoryType, groups]);

  const totalPurchaseOrders = useMemo(
    () => groups.reduce((sum, group) => sum + (group.purchase_history?.length ?? 0), 0),
    [groups],
  );

  const handleFilterTypeChange = (value: PoHistoryFilterType) => {
    setFilterType(value);
    if (value === "vendor") setSelectedComponents([]);
    if (value === "component") setSelectedVendors([]);
  };

  const handleSearch = () => {
    const component = showComponentField ? selectedComponents.map((item) => item.partNo) : [];
    const vendor = showVendorField ? selectedVendors.map((item) => item.id) : [];

    if (showComponentField && !component.length) {
      showToast("Please select at least one component", "error");
      return;
    }
    if (showVendorField && !vendor.length) {
      showToast("Please select at least one vendor", "error");
      return;
    }

    dispatch(fetchPoHistoryAsync({ component, vendor })).then((res: any) => {
      setHasSearched(true);
      const response = res.payload?.data;

      if (!response?.success) {
        showToast(
          response?.message || "Unable to fetch purchase history. Please try again.",
          "error",
        );
        return;
      }

      const groupList: { purchase_history?: unknown[] }[] = response.data ?? [];
      const poCount = groupList.reduce(
        (sum, group) => sum + (group.purchase_history?.length ?? 0),
        0,
      );

      if (poCount === 0) {
        const scope = showComponentField ? "component" : "vendor";
        showToast(
          `No purchase orders found for the selected ${scope}${
            (showComponentField ? component.length : vendor.length) > 1 ? "s" : ""
          }.`,
          "info",
        );
        return;
      }

      showToast(
        response.message || `Found ${poCount} purchase order${poCount === 1 ? "" : "s"}.`,
        "success",
      );
    });
  };

  return (
    <div className="h-full bg-white grid grid-cols-[300px_1fr] overflow-hidden">
      <PoHistoryFilters
        filterType={filterType}
        onFilterTypeChange={handleFilterTypeChange}
        showComponentField={showComponentField}
        showVendorField={showVendorField}
        selectedComponents={selectedComponents}
        onComponentsChange={setSelectedComponents}
        selectedVendors={selectedVendors}
        onVendorsChange={setSelectedVendors}
        loading={poHistoryLoading}
        onSearch={handleSearch}
      />

      <PoHistoryGrid
        groups={groups}
        gridMode={gridMode}
        loading={poHistoryLoading}
        hasSearched={hasSearched}
        totalPurchaseOrders={totalPurchaseOrders}
      />
    </div>
  );
};

export default PurchasedHistory;
