import React, {  useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

export type GroupdataType = {
  id: string;
  text: string;
};
type Props = {
  onChange: (value: GroupdataType | null) => void;
  value: GroupdataType | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  varient?: "outlined" | "standard" | "filled";
  required?: boolean;
  size?: "small" | "medium";
};

const SelectUom: React.FC<Props> = ({ value, onChange, label = "Select UOM", width = "100%", error, helperText, varient = "outlined", required = false, size = "medium" }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deviceList, setDeviceList] = useState<GroupdataType[]>([]);

  // Fetch devices based on SKU query
  const fetchDevices = async (_: string | null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/uom/uomSelect2`);
      setDeviceList(response.data.data); // Response is based on the LocationApiresponse type
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <Autocomplete
      onFocus={() => fetchDevices(null)}
      value={value}
      size={size}
      options={deviceList || []}
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

export default SelectUom;
