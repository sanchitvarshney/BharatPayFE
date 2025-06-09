import CustomSelect from "@/components/reusable/CustomSelect";
import React, { useCallback, useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DeviceMinReportTable from "@/table/report/DeviceMinReportTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  clearR1data,
  getMainR1Data,
} from "@/features/report/report/reportSlice";
import { CustomButton } from "@/components/reusable/CustomButton";
import { Search } from "lucide-react";
import CustomInput from "@/components/reusable/CustomInput";
import { AgGridReact } from "@ag-grid-community/react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import {
  Dialog,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import R1reportTable from "@/table/report/R1reportTable";
import { showToast } from "@/utils/toasterContext";
import { TransitionProps } from "@mui/material/transitions";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { useSocketContext } from "@/components/context/SocketContext";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Deviceinreport: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [type, setType] = useState<string>("min");
  const [detail, setDetail] = useState<boolean>(false);
  const [min, setMin] = useState<string>("");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const { r1Data, mainR1ReportLoading, mainR1Report } = useAppSelector(
    (state) => state.report
  );
  const { emitDownloadR1Report } = useSocketContext();
  const gridRef = useRef<AgGridReact<any>>(null);
  const { RangePicker } = DatePicker;

  const onBtExport = useCallback(() => {
    mainR1Report &&
      gridRef.current!.api.exportDataAsExcel({
        sheetName: "R1 Report", // Set your desired sheet name here
      });
  }, [mainR1Report]);

  const handleDownload = () => {
    emitDownloadR1Report({
      from: dayjs(date.from).format("DD-MM-YYYY"),
      to: dayjs(date.to).format("DD-MM-YYYY"),
      type: type,
      columns: [
        "MIN No.",
        "Insert Date",
        "SKU Code",
        "SKU Name",
        "Unit",
        "QTY",
        "In Location",
        "Vendor Name",
        "Vendor Code",
        "Vendor Address",
        "DOC Type",
        "DOC No.",
        "DOC Date",
      ],
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    dispatch(
      getMainR1Data({
        type: "date",
        from: dayjs(date.from).format("DD-MM-YYYY"),
        to: dayjs(date.to).format("DD-MM-YYYY"),
        data: "",
        page: page,
        limit: pageSize,
      })
    );
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    dispatch(
      getMainR1Data({
        type: "date",
        from: dayjs(date.from).format("DD-MM-YYYY"),
        to: dayjs(date.to).format("DD-MM-YYYY"),
        data: "",
        page: page,
        limit: size,
      })
    );
  };

  return (
    <>
      <Dialog
        fullScreen
        open={detail}
        TransitionComponent={Transition}
        onClose={() => setDetail(false)}
      >
        <div className="h-[50px] bg-neutral-200 flex items-center justify-between px-[10px]">
          <Typography variant="h3" fontSize={18} fontWeight={500}>
            <Typography fontWeight={500} fontSize={16}>
              #{min}
            </Typography>
          </Typography>
          <IconButton
            onClick={() => {
              setDetail(false);
              setMin("");
              dispatch(clearR1data());
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </div>
        <Divider />
        <div className="h-full grid grid-cols-[400px_1fr] bg-white">
          <div className="h-full border-r border-neutral-300">
            <Paper elevation={2} className="h-full rounded-md">
              <CardHeader className="p-0 h-[40px] flex justify-center px-[10px] bg-hbg border-b">
                <CardTitle className="font-[500] text-slate-600">
                  Report Detail
                </CardTitle>
              </CardHeader>
              <CardContent className="p-[10px] h-[calc(100vh-90px)] overflow-y-auto">
                <List>
                  <ListItem>
                    <ListItemText
                      primary="SKU Code"
                      secondary={r1Data ? r1Data?.head?.skuCode : "--"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="SKU Name"
                      secondary={
                        r1Data
                          ? r1Data?.head?.skuName + r1Data?.head?.uom
                          : "--"
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="IN Location"
                      secondary={r1Data ? r1Data?.head?.inLoc : "--"}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Vendor Code"
                      secondary={r1Data ? r1Data?.head?.vendorCode : "--"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Vendor Name"
                      secondary={r1Data ? r1Data?.head?.vendorName : "--"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Vendor Address"
                      secondary={
                        r1Data
                          ? replaceBrWithNewLine(r1Data?.head?.vendorAddress)
                          : "--"
                      }
                    />
                  </ListItem>
                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="Doc Type"
                      secondary={r1Data ? r1Data?.head?.docType : "--"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Doc No."
                      secondary={r1Data ? r1Data?.head?.docNo : "--"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Doc Date."
                      secondary={r1Data ? r1Data?.head?.docDate : "--"}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Paper>
          </div>
          <div>
            <div className="h-[calc(100vh-135px)] ">
              <DeviceMinReportTable gridRef={gridRef} />
            </div>
          </div>
        </div>
      </Dialog>
      <div className="flex bg-white h-[calc(100vh-100px)] relative">
        <div
          className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${
            colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "
          }`}
        >
          <div
            className={`transition-all ${
              colapse ? "left-0" : "left-[400px]"
            } w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
          >
            <Button
              onClick={() => setcolapse(!colapse)}
              className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}
            >
              {colapse ? (
                <Icons.right fontSize="small" />
              ) : (
                <Icons.left fontSize="small" />
              )}
            </Button>
          </div>
          <div className="overflow-x-hidden overflow-y-auto ">
            <div className="flex items-center gap-[10px] p-[10px]  mt-[20px]">
              <FormControl fullWidth>
                <Select
                  value={type}
                  defaultValue="min"
                  onChange={(e) => setType(e.target.value)}
                >
                  {[
                    { value: "min", label: "MIN", isDisabled: false },
                    { value: "date", label: "Date", isDisabled: false },
                    { value: "serial", label: "Serial", isDisabled: true },
                    {
                      value: "sim",
                      label: "SIM Availibility",
                      isDisabled: true,
                    },
                    { value: "docType", label: "Doc Type", isDisabled: true },
                    { value: "sku", label: "SKU", isDisabled: true },
                  ].map((item) => (
                    <MenuItem
                      disabled={item.isDisabled}
                      value={item.value}
                      key={item.value}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className=" p-[10px]">
              {type === "date" ? (
                <div className="flex flex-col gap-[20px] ">
                  <RangePicker
                    required
                    placement="bottomRight"
                    className="w-full h-[50px]"
                    format="DD-MM-YYYY"
                    // disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                    placeholder={["Start date", "End Date"]}
                    value={date.from && date.to ? [date.from, date.to] : null}
                    onChange={(range: [Dayjs | null, Dayjs | null] | null) => {
                      if (range) {
                        setDate({ from: range[0], to: range[1] });
                      } else {
                        setDate({ from: null, to: null });
                      }
                    }}
                    presets={rangePresets}
                  />
                  <div className="flex justify-between">
                    <LoadingButton
                      loadingPosition="start"
                      onClick={() => {
                        if (!date.from || !date.to) {
                          showToast("Please select date range", "error");
                        } else {
                          dispatch(
                            getMainR1Data({
                              type: "date",
                              from: dayjs(date.from).format("DD-MM-YYYY"),
                              to: dayjs(date.to).format("DD-MM-YYYY"),
                              data: "",
                              page: 1,
                              limit: pageSize,
                            })
                          );
                        }
                      }}
                      variant="contained"
                      loading={mainR1ReportLoading}
                      disabled={!date || mainR1ReportLoading}
                      startIcon={<SearchIcon fontSize="small" />}
                    >
                      Search
                    </LoadingButton>
                    <MuiTooltip title="Download" placement="right">
                      <LoadingButton
                        disabled={!mainR1Report}
                        variant="contained"
                        color="primary"
                        style={{
                          borderRadius: "50%",
                          width: 40,
                          height: 40,
                          minWidth: 0,
                          padding: 0,
                        }}
                        onClick={handleDownload}
                        size="small"
                        sx={{ zIndex: 1 }}
                      >
                        <Icons.download />
                      </LoadingButton>
                    </MuiTooltip>
                  </div>
                </div>
              ) : type === "serial" ? (
                <div className="flex flex-col gap-[20px] opacity-60 pointer-events-none">
                  <CustomInput required label="Serial No." />
                  <RangePicker
                    required
                    placement="bottomRight"
                    className="w-full"
                    format="DD-MM-YYYY"
                    // disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                    onChange={(e: any) => {
                      console.log(e);
                    }}
                    presets={rangePresets}
                  />
                  <CustomButton
                    icon={<Search className="h-[18px] w-[18px]" />}
                    className="bg-cyan-700 hover:bg-cyan-800 max-w-max"
                  >
                    Search
                  </CustomButton>
                </div>
              ) : type === "sim" ? (
                <div className="flex flex-col gap-[20px] opacity-60 pointer-events-none cursor-not-allowed">
                  <CustomSelect
                    placeholder={"SIM Availibility"}
                    className="w-full"
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                  />
                  <RangePicker
                    required
                    placement="bottomRight"
                    className="w-full"
                    format="DD-MM-YYYY"
                    // disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                    onChange={(e: any) => {
                      console.log(e);
                    }}
                    presets={rangePresets}
                  />
                  <CustomButton
                    icon={<Search className="h-[18px] w-[18px]" />}
                    className="bg-cyan-700 hover:bg-cyan-800 max-w-max"
                  >
                    Search
                  </CustomButton>
                </div>
              ) : type === "docType" ? (
                <div className="flex flex-col gap-[20px] opacity-60 pointer-events-none cursor-not-allowed">
                  <CustomSelect
                    required
                    placeholder={"Document Type"}
                    className="w-full"
                    options={[
                      { value: "CHL", label: "Challan" },
                      { value: "INV", label: "Invoice" },
                    ]}
                  />
                  <RangePicker
                    placement="bottomRight"
                    className="w-full"
                    format="DD-MM-YYYY"
                    // disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                    onChange={(e: any) => {
                      console.log(e);
                    }}
                    presets={rangePresets}
                  />
                  <CustomButton
                    icon={<Search className="h-[18px] w-[18px]" />}
                    className="bg-cyan-700 hover:bg-cyan-800 max-w-max"
                  >
                    Search
                  </CustomButton>
                </div>
              ) : type === "sku" ? (
                <div className="flex flex-col gap-[20px] opacity-60 pointer-events-none cursor-not-allowed">
                  <CustomInput label="SKU" required />
                  <RangePicker
                    placement="bottomRight"
                    className="w-full"
                    format="DD-MM-YYYY"
                    // disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                    onChange={(e: any) => {
                      console.log(e);
                    }}
                    presets={rangePresets}
                  />
                  <CustomButton
                    icon={<Search className="h-[18px] w-[18px]" />}
                    className="bg-cyan-700 hover:bg-cyan-800 max-w-max"
                  >
                    Search
                  </CustomButton>
                </div>
              ) : type === "min" ? (
                <div className="flex flex-col gap-[20px] ">
                  <TextField
                    label="MIN"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                  />

                  <div className="flex items-center justify-between">
                    <LoadingButton
                      className="max-w-max"
                      variant="contained"
                      loading={mainR1ReportLoading}
                      onClick={() => {
                        if (min) {
                          dispatch(
                            getMainR1Data({
                              type: "min",
                              data: min,
                              from: "",
                              to: "",
                              page: 1,
                              limit: pageSize,
                            })
                          ).then((response: any) => {
                            if (response.payload?.data?.success) {
                            }
                          });
                        } else {
                          showToast("Please enter MIN", "error");
                        }
                      }}
                      startIcon={<SearchIcon fontSize="small" />}
                    >
                      Search
                    </LoadingButton>
                    <MuiTooltip title="Download" placement="right">
                      <LoadingButton
                        disabled={!mainR1Report}
                        variant="contained"
                        color="primary"
                        style={{
                          borderRadius: "50%",
                          width: 40,
                          height: 40,
                          minWidth: 0,
                          padding: 0,
                        }}
                        onClick={() => onBtExport()}
                        size="small"
                        sx={{ zIndex: 1 }}
                      >
                        <Icons.download />
                      </LoadingButton>
                    </MuiTooltip>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="w-full">
          <R1reportTable
            gridRef={gridRef}
            setMin={setMin}
            setOpen={setDetail}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
          />
        </div>
      </div>
    </>
  );
};

export default Deviceinreport;
