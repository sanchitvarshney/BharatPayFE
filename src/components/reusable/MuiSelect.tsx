import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

// Define the type for the options prop
interface Option {
  value: string;
  label: string;
}

// Define the prop types for the component
interface ReusableSelectProps {
  options: Option[]; // Array of options to display in the dropdown
  label?: string; // Label for the select input
  value?: string | undefined; // Selected value
  onChange?: (value: string) => void; // Change handler
  fullWidth?: boolean; // Optional: Whether the select should take the full width
  sx?: object; // Optional: Custom styling
  variant?: "outlined" | "standard" | "filled";
}

const MuiSelect: React.FC<ReusableSelectProps> = ({ options, label, value, onChange, fullWidth = true, sx = { minWidth: 120 },variant }) => {
  const handleChange = (event: SelectChangeEvent) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <Box sx={sx}>
      <FormControl variant={variant} fullWidth={fullWidth}>
        <InputLabel id="select-label">{label}</InputLabel>
        <Select labelId="select-label" value={value} onChange={handleChange} label={label}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MuiSelect;
