import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/axiosInstance";
export type LocationType = {
  id: string;
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
  required?: boolean
  size?: "small" | "medium"
};

const SelectLocation: React.FC<Props> = ({ value, onChange, label = "Search Location", width = "100%", error, helperText,varient="standard",required=false,size="small" }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [locationList, setLocationList] = useState<LocationType[]>([]);

  // Fetch locations based on search query
  const fetchLocations = async (query: string|null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/backend/search/location/${query}`);
      setLocationList(response.data.data); // Assuming response follows LocationApiresponse format
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

  return (
    <Autocomplete
      onFocus={() => fetchLocations(null)}
      value={value}
      size={size}
      options={locationList || []}
      getOptionLabel={(option) => `${option.text}`}
      filterSelectedOptions
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      onInputChange={(_, newInputValue, reason) => {
        (reason === "input" || reason === "clear") && setInputValue(newInputValue);
      }}
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
            <p className="text-[13px]">{`${option.text}`}</p>
          </div>
        </li>
      )}
      sx={{ width }}
    />
  );
};

export default SelectLocation;
