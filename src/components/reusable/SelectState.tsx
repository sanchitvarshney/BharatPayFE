import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

export type StateData = {
  Name: string;
  Code: string;
};

type StateApiResponse = {
  status: string;
  message: string;
  success: boolean;
  data: StateData[];
};

type Props = {
  onChange: (value: StateData | null) => void;
  value: StateData | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  varient?: "outlined" | "standard" | "filled";
  required?: boolean;
  size?: "small" | "medium";
};

const SelectState: React.FC<Props> = ({ value, onChange, label = "Select State", width = "100%", error, helperText, varient = "outlined", required = false, size = "medium" }) => {
  const [stateList, setStateList] = useState<StateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch states on mount
  const fetchStates = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<StateApiResponse>(`/backend/stateCode`);
      if (response.data.success) {
        setStateList(response.data.data||[]);
      } else {
        setStateList([]);
        console.warn("Failed to fetch states:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  return (
    <Autocomplete
      value={value}
      size={size}
      options={stateList || []}
      getOptionLabel={(option) => `${option.Name} (${option.Code})`}
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.Code === value?.Code}
      renderInput={(params) => (
        <TextField
          required={required}
          error={error}
          helperText={helperText}
          {...params}
          label={label}
          variant={varient}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <div>
            <p className="text-[13px]">{`${option.Name} (${option.Code})`}</p>
          </div>
        </li>
      )}
      sx={{ width }}
    />
  );
};

export default SelectState;
