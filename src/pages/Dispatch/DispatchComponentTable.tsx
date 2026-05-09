import React, { useCallback, useEffect } from "react";
import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Icons } from "@/components/icons";
import { generateUniqueId } from "@/utils/uniqueid";
import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import AntLocationSelectAcordinttoModule from "@/components/reusable/antSelecters/AntLocationSelectAcordinttoModule";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { getPOComponentDetail } from "@/features/procurement/poSlices";

export interface DispatchComponentRow {
  partComponent: { lable?: string; label?: string; value: string } | null;
  qty: number;
  rate: string;
  taxableValue: number;
  foreignValue: number;
  hsnCode: string;
  gstType: string;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  location: { lable: string; value: string } | null;
  autoConsump: string;
  remarks: string;
  fromLocation: { label: string; value: string } | null;
  toLocation: { label: string; value: string } | null;
  id: string;
  currency: string;
  isNew?: boolean;
  excRate: number;
  uom: string;
}

type Props = {
  rowData: DispatchComponentRow[];
  setRowData: React.Dispatch<React.SetStateAction<DispatchComponentRow[]>>;
};

const DispatchComponentTable: React.FC<Props> = ({ rowData, setRowData }) => {
  const dispatch = useAppDispatch();
  const selectedFromLocation = rowData[0]?.fromLocation || null;
  const selectedToLocation = rowData[0]?.toLocation || null;

  const createEmptyRow = useCallback(
    (
      fromLocation: DispatchComponentRow["fromLocation"] = null,
      toLocation: DispatchComponentRow["toLocation"] = null
    ): DispatchComponentRow => ({
      id: generateUniqueId(),
      partComponent: null,
      qty: 0,
      rate: "",
      taxableValue: 0,
      foreignValue: 0,
      hsnCode: "",
      gstType: "L",
      gstRate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      location: null,
      autoConsump: "",
      remarks: "",
      fromLocation,
      toLocation,
      currency: "",
      isNew: true,
      excRate: 1,
      uom: "",
    }),
    []
  );

  const calculateRow = (
    row: DispatchComponentRow,
    updates: Partial<DispatchComponentRow>
  ) => {
    const nextRow = { ...row, ...updates };
    const taxableValue = Number(nextRow.qty || 0) * Number(nextRow.rate || 0);
    const gstAmount = (Number(nextRow.gstRate || 0) / 100) * taxableValue;

    return {
      ...nextRow,
      taxableValue,
      foreignValue: 0,
      cgst: nextRow.gstType === "L" ? gstAmount / 2 : 0,
      sgst: nextRow.gstType === "L" ? gstAmount / 2 : 0,
      igst: nextRow.gstType === "I" ? gstAmount : 0,
    };
  };

  const updateRow = (
    id: string,
    updates: Partial<DispatchComponentRow>,
    shouldCalculate = true
  ) => {
    setRowData((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? shouldCalculate
            ? calculateRow(row, updates)
            : { ...row, ...updates }
          : row
      )
    );
  };

  const handleAddRow = () => {
    setRowData((prevRows) => [
      createEmptyRow(selectedFromLocation, selectedToLocation),
      ...prevRows,
    ]);
  };

  useEffect(() => {
    if (rowData.length === 0) {
      setRowData([createEmptyRow()]);
    }
  }, [createEmptyRow, rowData.length, setRowData]);

  const handleDeleteRow = (id: string) => {
    setRowData(rowData.filter((row) => row.id !== id));
  };

  const updateAllRows = (updates: Partial<DispatchComponentRow>) => {
    setRowData((prevRows) =>
      prevRows.length > 0
        ? prevRows.map((row) => ({ ...row, ...updates }))
        : [createEmptyRow(updates.fromLocation || null, updates.toLocation || null)]
    );
  };

  return (
    <div className="w-full pt-[10px]">
      <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-[20px] mb-[15px]">
        <AntLocationSelectAcordinttoModule
          endpoint="/transaction/rm-inward-location"
          label="From Location"
          value={selectedFromLocation}
          onChange={(value) => updateAllRows({ fromLocation: value })}
        />
        <AntLocationSelectAcordinttoModule
          endpoint="/transaction/rm-inward-location"
          label="To Location"
          value={selectedToLocation}
          onChange={(value) => updateAllRows({ toLocation: value })}
        />
      </div>
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          minHeight: 180,
          overflowX: "auto",
          border: "1px solid #e5e7eb",
          boxShadow: "none",
        }}
      >
        <Table size="small" sx={{ minWidth: 1400 }}>
        <TableHead>
          <TableRow>
            <TableCell width={60}>#</TableCell>
            <TableCell width={90}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
                size="small"
                sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
              >
                <Icons.add fontSize="small" />
              </Button>
            </TableCell>
            <TableCell width={320}>Part Component</TableCell>
            <TableCell width={120}>Qty</TableCell>
            <TableCell width={140}>Rate</TableCell>
            <TableCell width={180}>Taxable Value</TableCell>
            <TableCell width={180}>HSN Code</TableCell>
            <TableCell width={180}>GST Type</TableCell>
            <TableCell width={180}>GST Rate</TableCell>
            <TableCell width={120}>CGST</TableCell>
            <TableCell width={120}>SGST</TableCell>
            <TableCell width={120}>IGST</TableCell>
            <TableCell width={220}>Remarks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <IconButton color="error" onClick={() => handleDeleteRow(row.id)}>
                  <Icons.delete fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell>
                <AntCompSelect
                  value={
                    row.partComponent
                      ? {
                          label:
                            row.partComponent.label ||
                            row.partComponent.lable ||
                            "",
                          value: row.partComponent.value,
                        }
                      : null
                  }
                  onChange={(value) => {
                    updateRow(row.id, { partComponent: value }, false);
                    if (value?.value) {
                      dispatch(getPOComponentDetail(value.value)).then((res) => {
                        const payload = res.payload as
                          | {
                              data?: {
                                status?: string;
                                data?: { hsn?: string };
                              };
                            }
                          | undefined;

                        if (payload?.data?.status === "success") {
                          updateRow(
                            row.id,
                            { hsnCode: payload.data.data?.hsn || "" },
                            false
                          );
                        }
                      });
                    }
                  }}
                  getUom={(uom) => updateRow(row.id, { uom }, false)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={row.qty}
                  onChange={(event) =>
                    updateRow(row.id, { qty: Number(event.target.value) })
                  }
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={row.rate}
                  onChange={(event) =>
                    updateRow(row.id, { rate: event.target.value })
                  }
                  fullWidth
                />
              </TableCell>
              <TableCell>{row.taxableValue.toFixed(2)}</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={row.hsnCode}
                  onChange={(event) =>
                    updateRow(row.id, { hsnCode: event.target.value }, false)
                  }
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={row.gstType}
                  onChange={(event) =>
                    updateRow(row.id, { gstType: event.target.value })
                  }
                  fullWidth
                >
                  <MenuItem value="L">Local</MenuItem>
                  <MenuItem value="I">Inter State</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={row.gstRate}
                  onChange={(event) =>
                    updateRow(row.id, { gstRate: Number(event.target.value) })
                  }
                  fullWidth
                />
              </TableCell>
              <TableCell>{row.cgst.toFixed(2)}</TableCell>
              <TableCell>{row.sgst.toFixed(2)}</TableCell>
              <TableCell>{row.igst.toFixed(2)}</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={row.remarks}
                  onChange={(event) =>
                    updateRow(row.id, { remarks: event.target.value }, false)
                  }
                  fullWidth
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DispatchComponentTable;
