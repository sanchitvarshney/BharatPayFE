import { Icons } from "@/components/icons";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { Autocomplete, CircularProgress, InputAdornment, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import SimMinTable from "@/table/wearhouse/SimMinTable";
import { generateUniqueId } from "@/utils/uniqueid";
import { showToast } from "@/utils/toasterContext";
import SelectMin, { MinType } from "@/components/reusable/SelectMin";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearMinInfo, createSiMMIN, getMinInfo } from "@/features/wearhouse/simmin/SimMinSlice";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
interface RowData {
  remark: string;
  isNew: boolean;
  id: string;
  sr_no: string;
}
type CompType = {
  componentName: string;
  componentkey: string;
  partNo: string;
  quantity: number;
  unit: string;
  hsn: string;
};
const SimMin: React.FC = () => {
  const dispatch = useAppDispatch();
  const { minInfo, getMinInfoLoading,createSimMinLoading } = useAppSelector((state) => state.simmin);
  const [component, setComponent] = React.useState<CompType | null>(null);
  const [min, setMin] = React.useState<MinType | null>(null);

  const [rowdata, setRowdata] = React.useState<RowData[]>([]);
  const [input, setInput] = React.useState<string>("");
  const isIMEIUnique = (sr_no: string) => {
    return !rowdata.some((row) => row.sr_no === sr_no);
  };

  const onsubmin = () => {
    if (rowdata.length > 0) {
      const remarks = rowdata.filter((row) => row.remark).map((row) => row.remark);
      const sr_no = rowdata.filter((row) => row.sr_no).map((row) => row.sr_no);
      dispatch(createSiMMIN({ remarks, sr_no, component: component?.componentkey || "", txnID: min?.minNo || "" })).then((res: any) => {
        if (res.payload.status === "success") {
          setRowdata([]);
          setMin(null);
          setComponent(null);
        }
      });
    }
  };
  useEffect(() => {
    if (min) {
      dispatch(getMinInfo(min.minNo));
    }
  }, [min]);

  return (
    <div className="h-[calc(100vh-100px)] bg-white  ">
      <div className="grid grid-cols-[400px_1fr] h-[calc(100vh-150px)]">
        <div className="border-r border-neutral-300 flex flex-col gap-[20px] p-[20px] overflow-y-auto h-full">
          <SelectMin
            value={min}
            onChange={(value) => {
              dispatch(clearMinInfo());
              setComponent(null);
              setMin(value);
            }}
          />
          <Autocomplete
            disabled={!minInfo}
            value={component}
            options={minInfo?.partList || []}
            getOptionLabel={(option) => `(${option.partNo})-${option.componentName}`}
            filterSelectedOptions
            onChange={(_, value) => {
              setComponent(value);
            }}
            loading={getMinInfoLoading}
            isOptionEqualToValue={(option, value) => option.componentkey === value.componentkey}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Select Component"}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {getMinInfoLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <div>
                  <p className="text-[13px]">{`(${option.partNo})-${option.componentName}`}</p>
                </div>
              </li>
            )}
          />
          {minInfo && (
            <List>
              <ListItem>
                <ListItemText primary="Vendor Name" secondary={minInfo?.headerInfo?.vendorName} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Vendor Code" secondary={minInfo?.headerInfo?.vendorCode} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Vendor Branch" secondary={replaceBrWithNewLine(minInfo?.headerInfo?.vendorBranch || "")} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Document Id" secondary={replaceBrWithNewLine(minInfo?.headerInfo?.docId || "")} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Document Date" secondary={replaceBrWithNewLine(minInfo?.headerInfo?.docDate || "")} />
              </ListItem>
            </List>
          )}
        </div>
        <div>
          <div className="h-[70px] flex items-center px-[20px] border-b border-neutral-300 justify-between">
            <TextField
              disabled={!component || rowdata.length === Number(component?.quantity)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scan QR Code"
              sx={{ width: "400px" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icons.qrScan />
                    </InputAdornment>
                  ),
                },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  //verify deuplicate IMEI
                  if (isIMEIUnique(input)) {
                    setRowdata([{ id: generateUniqueId(), sr_no: input, isNew: true, remark: "" }, ...rowdata]);
                    setInput("");
                  } else {
                    showToast("Serial No. already exists", "error");
                  }
                }
              }}
            />
            {component && <Typography fontWeight={600}>Scan only {component?.quantity} Serial No.</Typography>}
          </div>
          <SimMinTable rowData={rowdata} setRowdata={setRowdata} />
        </div>
      </div>
      <div className="h-[50px] flex items-center justify-end px-[20px] border-t border-neutral-300">
        <LoadingButton loading={createSimMinLoading} disabled={!component || rowdata.length !== Number(component?.quantity)} onClick={onsubmin} variant="contained" startIcon={<Icons.save />}>
          Save
        </LoadingButton>
      </div>
    </div>
  );
};

export default SimMin;
