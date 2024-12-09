import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

export type SubCategoryType = {
  catId: string;
  name: string;
};

type Props = {
  onChange: (value: SubCategoryType | null) => void;
  value: SubCategoryType | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  variant?: "outlined" | "standard" | "filled";
  required?: boolean;
  size?: "small" | "medium";
  categoryId: string | null;
  disabled?: boolean;
};

const SelectSubCategory: React.FC<Props> = ({ value, onChange, label = "Select Subcategory", width = "100%", error, helperText, variant = "outlined", required = false, size = "medium", categoryId,disabled= false }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [subCategoryList, setSubCategoryList] = useState<SubCategoryType[]>([]);

  // Fetch subcategories
  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/component/category/subCategoryList/${categoryId}`);
      if (response.data.success) {
        setSubCategoryList(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      if (!subCategoryList.length) fetchSubCategories();
    }
  }, [categoryId]);

  return (
    <Autocomplete
    disabled={disabled}
      value={value}
      size={size}
      options={subCategoryList || []}
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

export default SelectSubCategory;
