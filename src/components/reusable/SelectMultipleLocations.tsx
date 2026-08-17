import React from "react";
import { Autocomplete, Checkbox, TextField, CircularProgress, Chip } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { RawMaterialLocationType } from "@/features/rawMaterialReport/rawMaterialReportSlice";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props = {
  value: RawMaterialLocationType[];
  onChange: (value: RawMaterialLocationType[]) => void;
  options: RawMaterialLocationType[];
  loading?: boolean;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  required?: boolean;
  size?: "small" | "medium";
};

const getLocationLabel = (option: RawMaterialLocationType) => option.name ?? option.text ?? "";

const SelectMultipleLocations: React.FC<Props> = ({
  value,
  onChange,
  options,
  loading = false,
  label = "Select Location",
  width = "100%",
  error,
  helperText,
  required = false,
  size = "medium",
}) => {
  return (
    <Autocomplete
      multiple
      size={size}
      options={options || []}
      value={value}
      disableCloseOnSelect
      loading={loading}
      getOptionLabel={getLocationLabel}
      isOptionEqualToValue={(option, val) => getLocationLabel(option) === getLocationLabel(val)}
      onChange={(_, newValue) => onChange(newValue)}
      renderTags={(tagValue, getTagProps) => (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            maxHeight: 100,
            overflowY: "auto",
            padding: "2px 0",
          }}
        >
          {tagValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <Chip key={key} label={getLocationLabel(option)} size="small" {...tagProps} />;
          })}
        </div>
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} style={{ marginRight: 8 }} size="small" />
          {getLocationLabel(option)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required && value.length === 0}
          error={error}
          helperText={helperText}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{ width }}
    />
  );
};

export default SelectMultipleLocations;
