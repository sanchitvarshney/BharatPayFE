import React, { useState } from "react";
import { Input } from "antd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaSortDown } from "react-icons/fa6";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

const categoryOptions = [
  { value: "PART", label: "PART" },
  { value: "PCB", label: "PCB" },
  { value: "OTHER", label: "OTHER" },
  { value: "PACKING", label: "PACKING" },
];

const statusOptions = [
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];

const EditBomCellRenderer: React.FC<any> = ({
  value,
  colDef,
  data,
  api,
  column,
  node,
}) => {
  const [open, setOpen] = useState(false);
  // Handle input changes for status or quantity
  const handleChange = (newValue: any) => {
    // Update the corresponding row data field
    data[colDef.field] = newValue;

    // Refresh the grid after the change to reflect the updated value
    api.refreshCells({
      rowNodes: [node],
      columns: [column],
    });
    setOpen(false);
  };

  // Render Select for Status or Category, or Input for Quantity
  if (colDef.field === "bomstatus") {
    // Rendering Select for Status
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100%] justify-between  text-slate-600 items-center  border-slate-400 shadow-none"
          >
            {value
              ? statusOptions.find((option) => option.value === value)?.label
              : colDef.headerName}
            <FaSortDown className="w-5 h-5 ml-2 mb-[5px] opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0  ">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No {colDef.headerName} found.</CommandEmpty>
            <CommandList className="max-h-[400px] overflow-y-auto">
              {statusOptions.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto flex items-center gap-[10px]"
                  onSelect={(currentValue) => handleChange(currentValue)}
                >
                  {framework.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  if (colDef.field === "requiredQty") {
    // Rendering Input for Quantity (editable)
    return (
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        style={{ width: "100%" }}
      />
    );
  }

  if (colDef.field === "category") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100%] justify-between  text-slate-600 items-center  border-slate-400 shadow-none"
          >
            {value
              ? categoryOptions.find((option) => option.value === value)?.label
              : colDef.headerName}
            <FaSortDown className="w-5 h-5 ml-2 mb-[5px] opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0  ">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No {colDef.headerName} found.</CommandEmpty>
            <CommandList className="max-h-[400px] overflow-y-auto">
              {categoryOptions.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto flex items-center gap-[10px]"
                  onSelect={(currentValue) => handleChange(currentValue)}
                >
                  {framework.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  // Default case: Render value as plain text
  return <span>{value}</span>;
};

export default EditBomCellRenderer;
