import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/axiosInstance";

export type CountryData = {
  text: string;
  code: number;
};

type Props = {
  onChange: (value: CountryData | null) => void;
  value: CountryData | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  required?: boolean;
  varient?: "outlined" | "standard" | "filled";
  size?: "small" | "medium";
};

const SelectCountry: React.FC<Props> = ({ value, onChange, label = "Search Country", width = "100%", error, helperText, required = false, varient = "outlined", size = "medium" }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [countryList, setCountryList] = useState<CountryData[]>([]);

  const fetchCountries = async (query: string | null) => {
    setLoading(true);
    try {
      const endpoint = query ? `/backend/country?search=${query}` : `/backend/country`;
      const response = await axiosInstance.get(endpoint);
      setCountryList(response.data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedInputValue) {
      fetchCountries(debouncedInputValue);
    }
  }, [debouncedInputValue]);

  useEffect(() => {
    fetchCountries(null);
  }, []);

  return (
    <Autocomplete
      onFocus={() => fetchCountries(null)}
      value={value}
      size={size}
      options={countryList || []}
      getOptionLabel={(option) => `${option.text} (${option.code})`}
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

export default SelectCountry;
