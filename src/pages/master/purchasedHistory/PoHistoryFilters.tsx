import React from "react";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PoHistoryFilterType } from "@/features/master/componentPercentage/componentPercentageType";
import MultiSelect from "./MultiSelect";
import { filterTypeOptions } from "./poHistory.constants";
import {
  ComponentOption,
  VendorOption,
  loadAllComponents,
  loadAllVendors,
} from "./poHistory.api";

type Props = {
  filterType: PoHistoryFilterType;
  onFilterTypeChange: (value: PoHistoryFilterType) => void;
  showComponentField: boolean;
  showVendorField: boolean;
  selectedComponents: ComponentOption[];
  onComponentsChange: (value: ComponentOption[]) => void;
  selectedVendors: VendorOption[];
  onVendorsChange: (value: VendorOption[]) => void;
  loading: boolean;
  onSearch: () => void;
};

const PoHistoryFilters: React.FC<Props> = ({
  filterType,
  onFilterTypeChange,
  showComponentField,
  showVendorField,
  selectedComponents,
  onComponentsChange,
  selectedVendors,
  onVendorsChange,
  loading,
  onSearch,
}) => (
  <div className="h-full border-r border-neutral-300 flex flex-col overflow-y-auto">
    <div className="h-[52px] shrink-0 flex items-center px-[20px] border-b border-neutral-300 text-[14px] font-[600] text-slate-700">
      Filters
    </div>

    <div className="flex-1 p-[20px] flex flex-col gap-[16px]">
      <FormControl size="small" fullWidth>
        <InputLabel id="po-history-filter-type-label">Filter By</InputLabel>
        <Select
          labelId="po-history-filter-type-label"
          id="po-history-filter-type"
          value={filterType}
          label="Filter By"
          onChange={(event) =>
            onFilterTypeChange(event.target.value as PoHistoryFilterType)
          }
        >
          {filterTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {showComponentField && (
        <MultiSelect<ComponentOption>
          label="Components"
          value={selectedComponents}
          onChange={onComponentsChange}
          loadAll={loadAllComponents}
          getOptionLabel={(option) => `(${option.partNo})-${option.name}`}
          isOptionEqualToValue={(option, val) => option.key === val.key}
        />
      )}

      {showVendorField && (
        <MultiSelect<VendorOption>
          label="Vendors"
          value={selectedVendors}
          onChange={onVendorsChange}
          loadAll={loadAllVendors}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, val) => option.code === val.code}
        />
      )}
      <Typography variant="body2" color="textSecondary">
        Note: You can select multiple components or vendors for filtering.
      </Typography>
    </div>

    <div className="shrink-0 p-[20px] border-t border-neutral-300">
      <LoadingButton fullWidth loading={loading} variant="contained" onClick={onSearch}>
        Search
      </LoadingButton>
    </div>
  </div>
);

export default PoHistoryFilters;
