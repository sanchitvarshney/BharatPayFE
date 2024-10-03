import React from "react";
import Select, { Props as SelectProps, StylesConfig, components } from "react-select";
import { FaCaretDown } from "react-icons/fa";
import { Skeleton } from "../ui/skeleton";

interface OptionType {
  label: string;
  value: string;
}

interface ReactSelectProps extends SelectProps<OptionType, false> {
  isLoading?: boolean;
  required?: boolean;
  fullborder?: boolean;
}

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <FaCaretDown className="text-slate-400 text-[23px]" />
  </components.DropdownIndicator>
);

const CustomSelect: React.FC<ReactSelectProps> = ({
  isLoading = false,
  components: customComponents = { DropdownIndicator },
  loadingMessage = () => (
    <div className="flex flex-col gap-[10px]">
      <Skeleton className="h-[20px] w-full" />
      <Skeleton className="h-[20px] w-full" />
      <Skeleton className="h-[20px] w-full" />
      <Skeleton className="h-[20px] w-full" />
      <Skeleton className="h-[20px] w-full" />
    </div>
  ),
  fullborder = false,
  options,
  required = false,
  placeholder = "Select an option",
  ...props
}) => {
  const defaultStyles: StylesConfig<OptionType, false> = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: fullborder ? "5px" : "",
      border: fullborder ? "1px solid #94a3b8" : "none",
      borderBottom: !fullborder && state.isFocused ? "1px solid #94a3b8" : "1px solid #94a3b8",
      borderColor: state.isFocused ? "#94a3b8" : "#94a3b8",
      boxShadow: "none",
      color: "#475569",
      "&:hover": {
        borderColor: "#94a3b8",
      },
      background: "transparent",
      fontSize: "15px",
      cursor: "pointer",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#e2e8f0" : state.isFocused ? "#fff" : "white",
      color: state.isSelected ? "#475569" : state.isFocused ? "#475569" : "#475569",
      "&:hover": {
        backgroundColor: "#e2e8f0",
        color: "#475569",
      },
      borderRadius: "5px",
      transition: "all 0.1s",
      cursor: "pointer",
      fontSize: "15px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#475569",
    }),
    container: (provided) => ({
      ...provided,
    }),
    menu: (provided) => ({
      ...provided,
      background: "#fff",
      borderRadius: "10px",
      border: "none",
      boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
    }),
    menuList: (provided) => ({
      ...provided,
      background: "#fff",
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      borderRadius: "10px",
    }),
  };
  return (
    <Select
      isClearable
      styles={defaultStyles}
      components={customComponents}
      isLoading={isLoading}
      isSearchable
      loadingMessage={loadingMessage}
      options={options}
      placeholder={
        required ? (
          <span>
            {placeholder} <span className="text-red-500 text-[15px]">*</span>
          </span>
        ) : (
          placeholder
        )
      }
      {...props}
    />
  );
};

export default CustomSelect;
