import React, { useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { FormControl, IconButton, InputAdornment, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { Input } from "antd";
import { QrCodeScanner } from "@mui/icons-material";


const remarkOptions = [
  "Paytm Speaker",
  "Paytrm Swipe",
  "Phonepay Speaker",
  "Phonepay Swipe",
  "Googlepay Speaker",
  "Googlepay Swipe",
  "Other"
];


const RemarkCellRenderer: React.FC<any> = ({ value, data, api, column, node, setRowdata, rowData }) => {
  const [open, setOpen] = useState(false);
  const [customRemark, setCustomRemark] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (showCustomInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCustomInput]);

  const handleRemarkSelect = (selectedValue: string) => {
    if (selectedValue === "__CUSTOM__") {
      setShowCustomInput(true);
      return;
    }

    data.remark = selectedValue;

    const updatedRowData = Array.isArray(rowData)
      ? rowData.map((row: any) =>
          row.id === data.id ? { ...row, remark: selectedValue } : row
        )
      : rowData;
    setRowdata(updatedRowData);

    // Refresh the grid
    api.refreshCells({
      rowNodes: [node],
      columns: [column],
    });

    setOpen(false);
    setShowCustomInput(false);
    setCustomRemark("");
  };

  const handleCustomRemarkSubmit = () => {
    if (customRemark.trim()) {
      data.remark = customRemark.trim();

      const updatedRowData = Array.isArray(rowData)
        ? rowData.map((row: any) =>
            row.id === data.id ? { ...row, remark: customRemark.trim() } : row
          )
        : rowData;
      setRowdata(updatedRowData);

      // Refresh the grid
      api.refreshCells({
        rowNodes: [node],
        columns: [column],
      });

      setOpen(false);
      setShowCustomInput(false);
      setCustomRemark("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between  text-slate-600 items-center border-slate-400 shadow-none h-8 text-xs"
        >
          <span className="truncate">
            {value || data.remark || "Select Remark"}
          </span>
          <FaSortDown className="w-4 h-4 ml-2 mb-1 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search remarks..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !showCustomInput) {
                setShowCustomInput(true);
              }
            }}
          />
          <CommandEmpty>
            <div className="py-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setShowCustomInput(true)}
              >
                Add Custom Remark
              </Button>
            </div>
          </CommandEmpty>
          <CommandList className="max-h-[300px] overflow-y-auto">
            {remarkOptions.map((option) => (
              <CommandItem
                key={option}
                value={option}
                className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto"
                onSelect={() => handleRemarkSelect(option)}
              >
                {option}
              </CommandItem>
            ))}
            <CommandItem
              value="__CUSTOM__"
              className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto border-t mt-1"
              onSelect={() => setShowCustomInput(true)}
            >
              + Add Custom Remark
            </CommandItem>
            {showCustomInput && (
              <div className="p-2 border-t">
                <Input
                  ref={inputRef}
                  autoFocus
                  placeholder="Enter custom remark..."
                  value={customRemark}
                  onChange={(e) => setCustomRemark(e.target.value)}
                  onPressEnter={handleCustomRemarkSubmit}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCustomRemarkSubmit}
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomRemark("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};


const UniqueCellRenderer: React.FC<any> = ({ data, setRowdata }) => {
  const [localValue, setLocalValue] = useState(data?.uniqueNo ?? "");

  // Sync local state when row data changes from outside (e.g. new row)
  useEffect(() => {
    setLocalValue(data?.uniqueNo ?? "");
  }, [data?.id, data?.uniqueNo]);

  const handleBlur = () => {
    const val = localValue.trim();
    setRowdata((prev: any) =>
      Array.isArray(prev)
        ? prev.map((row: any) =>
            row.id === data.id ? { ...row, uniqueNo: val } : row
          )
        : prev
    );
  };

  return (
    <FormControl sx={{ width: "100%", my: 0.35 }}>
      <TextField
        size="small"
        value={localValue}
        placeholder="Enter Unique No"
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <QrCodeScanner fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};


type Props = {
  rowData: any;
  setRowdata: any;
  headername?: string
};
const FormTables: React.FC<Props> = ({ rowData, setRowdata, }) => {
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "rowIndex", sortable: true, filter: true, valueGetter: "node.rowIndex+1", width: 100 },
    { headerName: "AWB No.", field: "awbNo", sortable: true, filter: true, flex: 1 },
    { headerName: "Serial No.", field: "serialNo", sortable: true, filter: true, flex: 1 },
    { headerName: "IMEI No.", field: "imeiNo", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Unique No.",
      field: "uniqueNo",
      sortable: true,
      filter: true,
      minWidth: 350,
      flex: 1,
      cellRenderer: (params: any) => (
        <UniqueCellRenderer {...params} setRowdata={setRowdata} />
      )},

    {
      headerName: "Remark",
      field: "remark",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <RemarkCellRenderer
          {...params}
          setRowdata={setRowdata}
          rowData={rowData}
        />
      ),
      flex: 1,
      editable: false,
    },
    {
      headerName: "Action",
      field: "",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <IconButton
          onClick={() => {
            setRowdata(
              Array.isArray(rowData)
                ? rowData.filter((row: any) => row.id !== params.data.id)
                : []
            );
          }}
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      ),
      width: 100,
    },
  ];

  const gridRowData = Array.isArray(rowData) ? rowData : [];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-300px)] ">
      <AgGridReact overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={gridRowData} columnDefs={columnDefs} />
    </div>
  );
};

export default FormTables;
