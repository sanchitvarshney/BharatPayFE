import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

export type CountryData = {
  text: string;
  code: number;
};

type CountryApiResponse = {
  status: string;
  message: string;
  success: boolean;
  data: CountryData[];
};

type Props = {
  onChange: (value: CountryData | null) => void;
  value: CountryData | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  varient?: "outlined" | "standard" | "filled";
  required?: boolean;
  size?: "small" | "medium";
};

const SelectCountry: React.FC<Props> = ({
  value,
  onChange,
  label = "Select Country",
  width = "100%",
  error,
  helperText,
  varient = "outlined",
  required = false,
  size = "medium",
}) => {
  const [countryList, setCountryList] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch countries on mount
  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<CountryApiResponse>(`/backend/country`);
      if (response.data.success) {
        setCountryList(response.data.data || []);
      } else {
        setCountryList([]);
        console.warn("Failed to fetch countries:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <Autocomplete
      value={value}
      size={size}
      options={countryList || []}
      getOptionLabel={(option) => `${option.text} (${option.code})`}
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.code === value?.code}
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
            <p className="text-[13px]">{`${option.text} (${option.code})`}</p>
          </div>
        </li>
      )}
      sx={{ width }}
    />
  );
};

export default SelectCountry;
