import axiosInstance from "@/api/axiosInstance";
import { Select } from "antd";
import React, { useState } from "react";

export type PartCodeData = {
  id: string;
  text: string;
  part_code: string;
  material_code: string;
  specification: string;
  unit: string;
};

export type PartCodeDataResponse = {
  data: PartCodeData[];
  status: string;
  message: string;
  success: boolean;
};

type SelectPartCodeProps = {
  width?: string | number;
  value?: PartCodeData | undefined;
  onChange?: (selected: PartCodeData | undefined) => void;
};

const SelectPartCode: React.FC<SelectPartCodeProps> = ({ width = "100%", value, onChange }) => {
  const [options, setOptions] = useState<PartCodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<PartCodeData | undefined>(value);

  const handleSearch = async (value: string | null) => {
   
      setLoading(true);
      try {
        const response = await axiosInstance.get<PartCodeDataResponse>(`/backend/search/item/${value}`);
        if (response.data.success) {
          setOptions(response.data.data);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error("Error fetching part codes:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    
  };

  const handleChange = (id: string) => {
    const selectedOption = options.find((option) => option.id === id);
    setSelectedValue(selectedOption); // Set internal state
    onChange?.(selectedOption); // Return the selected full object to parent
  };

  return (
    <Select
      showSearch
      loading={loading}
      style={{ width }} // Set width based on the prop
      value={selectedValue?.id} // Show the selected option's ID as value
      onFocus={() => handleSearch(null)}
      onSearch={handleSearch}
      placeholder="Select Part Code"
      onChange={handleChange} // Handle selection change
      options={options.map((option) => ({
        label: `${option.part_code} - ${option.text}`,
        value: option.id,
      }))}
      filterOption={false} // Disable default filter, we are handling search server-side
    />
  );
};

export default SelectPartCode;
