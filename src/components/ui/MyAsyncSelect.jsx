import { useEffect, useState } from "react";
import { Select, Empty, Spin, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
const { Option } = Select;

export default function MyAsyncSelect({
  value,
  onChange,
  loadOptions,
  size,
  placeholder,
  onBlur,
  optionsState,
  defaultValue,
  selectLoading,
  labelInValue,
  borderBottom,
  mode,
  disabled,
  noBorder,
  color,
  hideArrow,
  searchIcon,
  onFocus,
  onMouseEnter,
  optionsList,
  ref,
}) {
  const [searchValue, setSearchValue] = useState("");
  const updatedValue = useDebounce(searchValue);

  useEffect(() => {
    if (updatedValue.length >= 3) {
      loadOptions(updatedValue);
    }
  }, [updatedValue]);
  return (
    // <div className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0">
    <Select
      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onBlur={onBlur}
      disabled={disabled}
      showSearch
      bordered={noBorder ? false : true}
      value={value}
      placeholder={placeholder}
      onFocus={onFocus}
      // suffixIcon={<SearchOutlined />}
      // allowClear
      defaultValue={defaultValue}
      mode={mode}
      showArrow={hideArrow ? false : true}
      size={size ? size : "default"}
      style={{
        width: "100%",
        color: color,
        cursor: "pointer",
      }}
      filterOption={false}
      onSearch={(value) => {
        setSearchValue(value);
      }}
      onChange={onChange}
      notFoundContent={
        selectLoading ? (
          <Row justify="center" style={{ padding: 5 }}>
            <Spin size="small" />
          </Row>
        ) : null
      }
      labelInValue={labelInValue}
      options={(optionsState || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
      optionsList={(optionsState || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    >
      {/* <div className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0 mt -1"></div> */}
    </Select>
    // </div>
  );
}

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};
