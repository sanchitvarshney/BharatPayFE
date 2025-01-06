import React, { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/axiosInstance";
import { Select } from "antd";

export type CategoryType = {
  catId: string;
  name: string;
};

type Props = {
  onChange: (value: { label: string; value: string } | null) => void;
  value: { label: string; value: string } | null;
  label?: string;
  width?: string;
};

const AntSelectCategory: React.FC<Props> = ({ value, onChange, label = "Search Category", width = "100%" }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  // Fetch categories based on search query
  const fetchCategories = async (query: string | null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/component/category/categoryList`, {
        params: query ? { search: query } : {},
      });
      if (response.data.success) {
        setCategoryList(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedInputValue) {
      fetchCategories(debouncedInputValue);
    }
  }, [debouncedInputValue]);

  return (
    <Select
      onFocus={() => fetchCategories(null)}
      filterOption={false}
      showSearch
      loading={loading}
      className={`w-[${width}] custom-select`}
      value={value?.value}
      onSearch={(input) => {
        if (input) {
          setInputValue(input);
        } else {
          fetchCategories(null);
        }
      }}
      placeholder={label}
      onChange={(selectedValue) => {
        const selectedCategory = categoryList.find((category) => category.catId === selectedValue);
        onChange({ value: selectedCategory!.catId, label: `${selectedCategory?.name}` });
      }}
      options={
        categoryList.length > 0
          ? categoryList?.map((category) => ({
              value: category.catId,
              label: `${category.name}`,
            }))
          : value
          ? [value]
          : []
      }
    />
  );
};

export default AntSelectCategory;
