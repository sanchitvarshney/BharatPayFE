import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

export type CategoryType = {
  catId: string;
  name: string;
};

type Props = {
  onChange: (value: CategoryType | null) => void;
  value: CategoryType | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  variant?: "outlined" | "standard" | "filled";
  required?: boolean;
  size?: "small" | "medium";
};

const SelectCategory: React.FC<Props> = ({ value, onChange, label = "Select Category", width = "100%", error, helperText, variant = "outlined", required = false, size = "medium" }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  // Fetch categories based on query
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/component/category/categoryList`);
      setCategoryList(response.data.data); // Update with fetched category list
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categoryList.length) fetchCategories();
  }, []);

  return (
    <Autocomplete
      value={value}
      size={size}
      options={categoryList || []}
      getOptionLabel={(option) => `${option.name}`}
      filterSelectedOptions
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.catId === value?.catId}
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
            <p className="text-[13px]">{`${option.name}`}</p>
          </div>
        </li>
      )}
      sx={{ width }}
    />
  );
};

export default SelectCategory;
