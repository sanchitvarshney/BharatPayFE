import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, ListItem, ListItemText, TextField } from "@mui/material";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/axiosInstance";

export type MinType = {
  minNo: string;
  insertDt: string;
  timeAgo: string;
};

type Props = {
  onChange: (value: MinType | null) => void;
  value: MinType | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  varient?: "outlined" | "standard" | "filled";
  required?: boolean;
  size?: "small" | "medium";
};

const SelectMin: React.FC<Props> = ({ value, onChange, label = "Search MIN", width = "100%", error, helperText, varient = "outlined", required = false, size = "medium" }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [minList, setMinList] = useState<MinType[]>([]);

  // Fetch MINs based on query
  const fetchMins = async (query: string | null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/backend/min/list${query ? `?search=${query}` : ""}`);
      setMinList(response.data.data);
    } catch (error) {
      console.error("Error fetching MINs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedInputValue) {
      fetchMins(debouncedInputValue);
    }
  }, [debouncedInputValue]);

  return (
    <Autocomplete
      onFocus={() => fetchMins(null)}
      value={value}
      size={size}
      options={minList || []}
      getOptionLabel={(option) => option.minNo}
      filterSelectedOptions
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.minNo === value?.minNo}
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
        <ListItem
          {...props}
          sx={{
            "&:hover": {
              backgroundColor: "#ecfeff",
            },
          }}
        >
          <ListItemText
            primary={option.minNo}
            secondary={
              <div className="flex items-center justify-between">
                <span className="text-[12px]">{option.insertDt}</span>
                <span className="text-[12px]">{option.timeAgo}</span>
              </div>
            }
          />
        </ListItem>
      )}
      sx={{ width }}
    />
  );
};

export default SelectMin;
