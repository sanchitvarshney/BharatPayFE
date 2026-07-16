import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CardContent,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "antd";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import * as XLSX from "xlsx";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  getDeviceImages,
  resetDeviceImages,
  DeviceImage,
} from "@/features/common/commonSlice";
import { rangePresets } from "@/utils/rangePresets";
import dayjs, { Dayjs } from "dayjs";
import FqcImagePreviewModal from "@/pages/queries/fqcDeviceImage/FqcImagePreviewModal";
const { RangePicker } = DatePicker;
const ViewImage: React.FC = () => {
  const [deviceType, setDeviceType] = useState<string>("");
  const [awbNumber, setAwbNumber] = useState<string>("");
  const [serialNo, setSerialNo] = useState<string>("");
  const [simFilterBy, setSimFilterBy] = useState<"serialNo" | "date">(
    "serialNo",
  );
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const { deviceImages, deviceImagesLoading, deviceImagesError } =
    useAppSelector((state) => state.common);

  const isSimDateFilter = deviceType === "sim" && simFilterBy === "date";

  useEffect(() => {
    dispatch(resetDeviceImages());
    setCurrentImageIdx(0);
    setPreviewIndex(null);
  }, [deviceType, awbNumber, serialNo, simFilterBy, date.from, date.to, dispatch]);

  const handleImagePreview = (row: DeviceImage) => {
    const idx = deviceImages?.indexOf(row) ?? -1;
    setPreviewIndex(idx >= 0 ? idx : 0);
  };
  const handlePreviewClose = () => setPreviewIndex(null);

  const previewRow =
    previewIndex !== null ? deviceImages?.[previewIndex] : undefined;

  const onBtExport = useCallback(() => {
    if (!deviceImages || deviceImages.length === 0) return;
    const rows = deviceImages.map((item, idx) => ({
      "#": idx + 1,
      Serial: item.serial || "",
      "SIM No": item.sim_no || "",
      Operator: item.operator || "",
      "Image URL": item.img_url?.[0] || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 24 },
      { wch: 16 },
      { wch: 60 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SIM Images");
    XLSX.writeFile(workbook, "SIM-Images.xlsx");
  }, [deviceImages]);

  const simImageColumnDefs = useMemo<ColDef<DeviceImage>[]>(
    () => [
      { headerName: "#", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: "Serial", field: "serial", flex: 1, minWidth: 160 },
      { headerName: "SIM No", field: "sim_no", flex: 1, minWidth: 180 },
      { headerName: "Operator", field: "operator", flex: 1, minWidth: 120 },
      {
        headerName: "Image",
        width: 100,
        sortable: false,
        filter: false,
        valueGetter: (params) => params.data?.img_url?.[0] || "",
        cellRenderer: (params: ICellRendererParams<DeviceImage>) => {
          const url = params.data?.img_url?.[0];
          if (!url || !params.data) return null;
          return (
            <button
              type="button"
              onClick={() => handleImagePreview(params.data as DeviceImage)}
              className="flex items-center h-full"
            >
              <img
                src={url}
                alt={params.data?.serial || "image"}
                className="h-[40px] w-[40px] object-cover rounded border cursor-pointer"
              />
            </button>
          );
        },
      },
    ],
    [deviceImages],
  );

  const handleSearch = async () => {
    const needsAwb = deviceType && deviceType !== "sim" && deviceType !== "ber";
    const needsSerialNo = !isSimDateFilter;
    if (
      !deviceType ||
      (needsSerialNo && !serialNo) ||
      (isSimDateFilter && (!date.from || !date.to)) ||
      (needsAwb && !awbNumber)
    ) {
      showToast(
        "Please enter Device Type" +
          (needsSerialNo ? ", Serial Number" : "") +
          (isSimDateFilter ? ", and select Date Range" : "") +
          (needsAwb ? ", and AWB Number" : ""),
        "error",
      );
      return;
    }
    setCurrentImageIdx(0);
    dispatch(
      getDeviceImages({
        deviceType,
        awbNumber: awbNumber || "",
        serialNo: needsSerialNo ? serialNo : "",
        from:
          isSimDateFilter && date.from
            ? dayjs(date.from).format("DD-MM-YYYY")
            : "",
        to:
          isSimDateFilter && date.to
            ? dayjs(date.to).format("DD-MM-YYYY")
            : "",
      }),
    );
  };
  const handlePrev = () => {
    if (!deviceImages) return;
    setCurrentImageIdx((idx) =>
      idx === 0 ? deviceImages.length - 1 : idx - 1,
    );
  };
  const handleNext = () => {
    if (!deviceImages) return;
    setCurrentImageIdx((idx) =>
      idx === deviceImages.length - 1 ? 0 : idx + 1,
    );
  };
  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  };

  const currentImage = deviceImages?.[currentImageIdx];
  const currentImgUrl = currentImage?.img_url?.[0];
  const currentTitle =
    currentImage?.img_name ||
    currentImage?.operator ||
    currentImage?.sim_no ||
    "Image";

  return (
    <div className="relative flex bg-white">
      {/* Left: Device Info & Search */}
      <div
        className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)] border-r border-neutral-300 min-w-[400px] max-w-[400px] items-center`}
      >
        <Paper elevation={0} className="m-2 w-full">
          <CardContent>
            <div className="flex flex-col gap-[20px] px-[0px] py-[0px]">
              <div className="flex flex-col gap-[10px]">
                <Typography
                  variant="subtitle1"
                  className="text-slate-600 font-medium"
                >
                  Device Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Device Type" }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(203 213 225)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(148 163 184)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(14 116 144)",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Device Type</em>
                    </MenuItem>
                    <MenuItem value="soundbox">Sound Box Image</MenuItem>
                    <MenuItem value="swipe">Swipe Machine Image</MenuItem>
                    <MenuItem value="sim">SIM Image</MenuItem>
                    <MenuItem value="ber">BER Device</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {deviceType !== "sim" && deviceType !== "ber" && (
                <div className="flex flex-col gap-[10px]">
                  <Typography
                    variant="subtitle1"
                    className="text-slate-600 font-medium"
                  >
                    AWB Number
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={awbNumber}
                    onChange={(e) => setAwbNumber(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgb(203 213 225)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgb(148 163 184)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "rgb(14 116 144)",
                        },
                      },
                    }}
                  />
                </div>
              )}
              {deviceType === "sim" && (
                <div className="flex flex-col gap-[10px]">
                  <Typography
                    variant="subtitle1"
                    className="text-slate-600 font-medium"
                  >
                    Filter By
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={simFilterBy}
                      onChange={(e) =>
                        setSimFilterBy(
                          e.target.value as "serialNo" | "date",
                        )
                      }
                      inputProps={{ "aria-label": "Filter By" }}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgb(203 213 225)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgb(148 163 184)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgb(14 116 144)",
                        },
                      }}
                    >
                      <MenuItem value="serialNo">Serial Number</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}
              {isSimDateFilter && (
                <RangePicker
                  className="w-full h-[55px] border-2 border-neutral-300 rounded-0 "
                  presets={rangePresets}
                  onChange={handleDateChange}
                  disabledDate={(current) => current && current > dayjs()}
                  placeholder={["Start date", "End Date"]}
                  value={date.from && date.to ? [date.from, date.to] : null}
                  format="DD/MM/YYYY"
                />
              )}
              {!isSimDateFilter && (
                <div className="flex flex-col gap-[10px]">
                  <Typography
                    variant="subtitle1"
                    className="text-slate-600 font-medium"
                  >
                    {deviceType === "sim"
                      ? "Device Serial Number"
                      : "Serial Number"}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgb(203 213 225)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgb(148 163 184)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "rgb(14 116 144)",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <div className="h-[50px] px-[20px] flex items-center justify-between gap-[10px] pb-4">
            <LoadingButton
              loading={deviceImagesLoading}
              onClick={handleSearch}
              startIcon={<Icons.search />}
              variant="contained"
            >
              Search
            </LoadingButton>
            {isSimDateFilter && (
              <LoadingButton
                onClick={onBtExport}
                disabled={!deviceImages || deviceImages.length === 0}
                variant="contained"
                color="primary"
                title="Download Excel"
                sx={{
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  minWidth: 0,
                  padding: 0,
                }}
              >
                <Icons.download fontSize="small" />
              </LoadingButton>
            )}
          </div>
          {deviceType === "ber" &&
            deviceImages &&
            deviceImages?.length > 0 &&
            (() => {
              const berInfo = deviceImages[currentImageIdx] ?? deviceImages[0];
              const hasBerInfo =
                berInfo?.serial ?? berInfo?.imei ?? berInfo?.insertDt;
              if (!hasBerInfo) return null;
              return (
                <CardContent className="pt-0">
                  <Typography
                    variant="subtitle1"
                    className="text-slate-700 font-semibold mb-2 px-[20px]"
                  >
                    Device details
                  </Typography>
                  <div className="flex flex-col gap-[12px] px-[20px] pb-4">
                    {berInfo.serial && (
                      <div>
                        <Typography
                          variant="caption"
                          className="text-slate-500"
                        >
                          Serial
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {berInfo.serial}
                        </Typography>
                      </div>
                    )}
                    {berInfo.imei && (
                      <div>
                        <Typography
                          variant="caption"
                          className="text-slate-500"
                        >
                          IMEI
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {berInfo.imei}
                        </Typography>
                      </div>
                    )}
                    {berInfo.insertDt && (
                      <div>
                        <Typography
                          variant="caption"
                          className="text-slate-500"
                        >
                          Insert date
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {berInfo.insertDt}
                        </Typography>
                      </div>
                    )}
                  </div>
                </CardContent>
              );
            })()}
        </Paper>
      </div>
      {/* Right: Image Carousel & Device Info */}
      <div className="w-full flex flex-col h-[calc(100vh-100px)] overflow-y-auto items-center justify-center">
        <div className="flex flex-col items-center justify-center h-full w-full p-6">
          {deviceImagesLoading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : deviceImagesError ? (
            <Typography color="error">{deviceImagesError}</Typography>
          ) : !deviceImages || deviceImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src="/search.svg"
                className="w-[200px] opacity-60 mb-4"
                alt="No images"
              />
              <Typography variant="body2" color="textSecondary">
                No images to display
              </Typography>
            </div>
          ) : isSimDateFilter ? (
            <div className="ag-theme-quartz w-full h-full">
              <AgGridReact<DeviceImage>
                rowData={deviceImages}
                columnDefs={simImageColumnDefs}
                animateRows
                rowHeight={50}
                headerHeight={50}
                suppressContextMenu
              />
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="relative w-full flex items-center justify-center">
                {deviceImages.length > 1 && (
                  <IconButton
                    onClick={handlePrev}
                    className="absolute left-0 z-10"
                  >
                    <Icons.left fontSize="large" />
                  </IconButton>
                )}
                <div className="flex flex-col items-center w-full">
                  <img
                    src={currentImgUrl}
                    alt={currentTitle}
                    onClick={() =>
                      currentImage && handleImagePreview(currentImage)
                    }
                    className="rounded-lg object-contain max-h-[400px] max-w-full border shadow cursor-pointer"
                  />
                  <Typography
                    variant="subtitle1"
                    className="mt-2 font-semibold text-slate-700"
                  >
                    {currentTitle}
                  </Typography>
                  {(currentImage?.operator || currentImage?.sim_no) && (
                    <Typography
                      variant="caption"
                      className="text-slate-500 mt-1"
                    >
                      {currentImage?.operator && currentImage?.sim_no
                        ? " • "
                        : ""}
                      {currentImage?.sim_no
                        ? `SIM No: ${currentImage.sim_no}`
                        : ""}
                    </Typography>
                  )}
                </div>
                {deviceImages.length > 1 && (
                  <IconButton
                    onClick={handleNext}
                    className="absolute right-0 z-10"
                  >
                    <Icons.right fontSize="large" />
                  </IconButton>
                )}
              </div>
              {deviceImages.length > 1 && (
                <Typography variant="caption" className="mt-2 text-slate-500">
                  {currentImageIdx + 1} / {deviceImages.length}
                </Typography>
              )}
            </div>
          )}
        </div>
      </div>
      <FqcImagePreviewModal
        open={previewIndex !== null}
        label={previewRow?.serial || previewRow?.sim_no || "Image"}
        imageUrl={previewRow?.img_url?.[0]}
        currentIndex={previewIndex ?? 0}
        total={ 0}
        onClose={handlePreviewClose}
     
      />
    </div>
  );
};

export default ViewImage;
