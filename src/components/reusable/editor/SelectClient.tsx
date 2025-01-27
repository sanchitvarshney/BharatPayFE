import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/axiosInstance";
import { useAppSelector } from "@/hooks/useReduxHook";
export type LocationType = {
  code: string;
  text: string;
};
type Props = {
  onChange: (value: LocationType | null) => void;
  value: LocationType | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  varient?: "outlined" | "standard" | "filled";
  required?: boolean;
  size?: "small" | "medium";
  tabindex?: number;
  endPoint: string;
};

const SelectClient: React.FC<Props> = ({ value, onChange, label = "Search Client", width = "100%", error, helperText, varient = "outlined", required = false, size = "medium", tabindex = 0, endPoint }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [clientData, setClientData] = useState<LocationType[]>([]);
  const { clientList } = useAppSelector((state) => state.dispatch);

  const fetchLocations = async (query: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${endPoint}?search=${query}`);
      setClientData(response.data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedInputValue) {
      fetchLocations(debouncedInputValue);
    }
  }, [debouncedInputValue]);
  useEffect(() => {
    fetchLocations("");
  }, [clientList]);

  return (
    <Autocomplete
      value={value}
      size={size}
      options={clientData || []}
      getOptionLabel={(option) => `${option.text}`}
      filterSelectedOptions
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.code === value?.code}
      onInputChange={(_, newInputValue, reason) => {
        (reason === "input" || reason === "clear") && setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          tabIndex={tabindex}
          required={required}
          error={error}
          helperText={helperText}
          {...params}
          label={label}
          variant={varient}
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

export default SelectClient;
