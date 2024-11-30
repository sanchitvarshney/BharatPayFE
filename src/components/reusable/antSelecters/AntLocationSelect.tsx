import React, { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/axiosInstance";
import { Select } from "antd";

export type SkuType = {
    id: string;
    text: string;
};

type Props = {
  onChange: (value: { label: string; value: string } | null) => void;
  value: { label: string; value: string } | null;
  label?: string;
  width?: string;
};

const AntLocationSelect: React.FC<Props> = ({ value, onChange, label = "Search Item", width = "100%" }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [itemList, setItemList] = useState<SkuType[]>([]);

  // Fetch items based on search query
  const fetchItems = async (query: string | null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/backend/search/location/${query}`);
      if (response.data.success) {
        setItemList(response.data.data||[]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedInputValue) {
      fetchItems(debouncedInputValue);
    }
  }, [debouncedInputValue]);

  return (
    <Select
      onFocus={() => fetchItems(null)}
      filterOption={false} // Disable default filtering as we are implementing a custom filter.
      showSearch
      loading={loading}
      className={`w-[${width}] custom-select`}
      value={value?.value}
      onSearch={(input) => {
        if (input) {
          setInputValue(input);
        } else {
          fetchItems(null);
        }
      }} // Fetch data dynamically based on search input.
      placeholder={label}
      onChange={(selectedValue) => {
        const selectedItem = itemList.find((item) => item.id === selectedValue);
        onChange({ value: selectedItem!.id, label: `${selectedItem?.text}` });
      
      }}
      options={ itemList.length > 0
        ? itemList?.map((item) => ({
            value: item.id,
            label: `${item.text}`, // Combines part_code and text for display.
          }))
        : value
        ? [value]
        : []}
    />
  );
};

export default AntLocationSelect;
