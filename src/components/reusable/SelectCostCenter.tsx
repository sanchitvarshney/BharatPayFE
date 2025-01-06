import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

export type CostCenterType = {
  id: string;
  text: string;
};

type Props = {
  onChange: (value: CostCenterType | null) => void;
  value: CostCenterType | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  variant?: "outlined" | "standard" | "filled";
  required?: boolean;
  size?: "small" | "medium";
};

const SelectCostCenter: React.FC<Props> = ({
  value,
  onChange,
  label = "Select Cost Center",
  width = "100%",
  error,
  helperText,
  variant = "outlined",
  required = false,
  size = "medium",
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [costCenterList, setCostCenterList] = useState<CostCenterType[]>([]);

  // Fetch cost centers based on query
  const fetchCostCenters = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/backend/costcenter`);
      setCostCenterList(response.data.data); // Update with fetched cost center list
    } catch (error) {
      console.error("Error fetching cost centers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!costCenterList.length) fetchCostCenters();
  }, []);

  return (
    <Autocomplete
      value={value}
      size={size}
      options={costCenterList || []}
      getOptionLabel={(option) => `${option.text}`}
      filterSelectedOptions
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      renderInput={(params) => (
        <TextField
          required={required}
          error={error}
          helperText={helperText}
          {...params}
          label={label}
          variant={variant}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <div>
            <p className="text-[13px]">{`${option.text}`}</p>
          </div>
        </li>
      )}
      sx={{ width }}
    />
  );
};

export default SelectCostCenter;
