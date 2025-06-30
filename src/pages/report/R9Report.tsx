import React, { useState} from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { getWrongDeviceReport } from "@/features/report/report/reportSlice";
import { DatePicker } from "antd";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Icons } from "@/components/icons";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import RangeSelect from "@/components/reusable/antSelecters/RangeSelect";
import R9ReportTable from "@/table/report/R9ReportTable";
import { showToast } from "@/utils/toasterContext";
import { getr9Report } from "@/features/report/report/reportSlice";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import WrongDeviceTable from "@/table/report/WrongDeviceTable";
import { useSocketContext } from "@/components/context/SocketContext";
const { RangePicker } = DatePicker;

const R9Report: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [partner, setpartner] = useState<string>("eCOM");
  const [isWrongDevice, setIsWrongDevice] = useState<boolean>(false);
  const [wrongDevicePartner, setWrongDevicePartner] = useState<string>("eCOM");
  const {emitDeviceInwardReport,emitWrongDeviceReport,isConnected} = useSocketContext();
  const [dateRange, setDateRange] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({
    from: null,
    to: null,
  });
  const [reportDate, setReportDate] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({
    from: null,
    to: null,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const dispatch = useAppDispatch();
  const {
    r9ReportLoading,
    wrongDeviceReportLoading,
  } = useAppSelector((state) => state.report);
  const handleDateChange = (dates: {
    from: Dayjs | null;
    to: Dayjs | null;
  }) => {
    setDateRange(dates);
  };

  // const onBtExport = useCallback(() => {
  //   mainR1Report &&
  //     gridRef.current!.api.exportDataAsExcel({
  //       sheetName: "R1 Report", // Set your desired sheet name here
  //     });
  // }, [mainR1Report]);

const handleExport =()=>{
  if (dateRange.from && dateRange.to && partner) {
    emitDeviceInwardReport({
        fromDt: dayjs(dateRange.from).format("YYYY-MM-DD"),
        toDt: dayjs(dateRange.to).format("YYYY-MM-DD"),
        partner: partner,
      })
  }
}
const exportWrongDeviceData =()=>{
  if (reportDate.from && reportDate.to && partner) {
    emitWrongDeviceReport({
        fromDate: dayjs(reportDate.from).format("DD-MM-YYYY"),
        toDate: dayjs(reportDate.to).format("DD-MM-YYYY"),
        deliveryPartner: partner,
      })
  }
}

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (dateRange.from && dateRange.to && partner) {
      dispatch(
        getr9Report({
          from: dayjs(dateRange.from).format("YYYY-MM-DD"),
          to: dayjs(dateRange.to).format("YYYY-MM-DD"),
          partner: partner,
          page: page,
          limit: pageSize,
        })
      );
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    if (dateRange.from && dateRange.to && partner) {
      dispatch(
        getr9Report({
          from: dayjs(dateRange.from).format("YYYY-MM-DD"),
          to: dayjs(dateRange.to).format("YYYY-MM-DD"),
          partner: partner,
          page: 1,
          limit: newPageSize,
        })
      );
    }
  };

  const handleWrongDevicePageChange = (page: number) => {
    setCurrentPage(page);
    if (reportDate.from && reportDate.to && partner) {
      dispatch(
        getWrongDeviceReport({
          type: wrongDevicePartner,
          from: dayjs(reportDate.from).format("DD-MM-YYYY"),
          to: dayjs(reportDate.to).format("DD-MM-YYYY"),
          page: page,
          limit: pageSize,
        })
      );
    }
  };

  const handleWrongDevicePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    if (reportDate.from && reportDate.to && partner) {
      dispatch(
        getWrongDeviceReport({
          type: wrongDevicePartner,
          from: dayjs(reportDate.from).format("DD-MM-YYYY"),
          to: dayjs(reportDate.to).format("DD-MM-YYYY"),
          page: 1,
          limit: newPageSize,
        })
      );
    }
  };

  return (
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
        <div className="p-[20px] overflow-hidden ">
          <div className="flex flex-col gap-[20px]">
            <RangeSelect
              value={dateRange}
              onChange={handleDateChange}
              disabledDate={(current) => {
                return current ? current > dayjs() : false;
              }}
              format="DD/MM/YYYY"
              presets={rangePresets}
              placeholder={["Start Date", "End Date"]}
            />
            <FormControl fullWidth>
              <Select
                value={partner}
                defaultValue="min"
                onChange={(e) => setpartner(e.target.value)}
              >
                {[
                  { value: "eKart", label: "eKart", isDisabled: false },
                  { value: "eCOM", label: "eCOM", isDisabled: false },
                  { value: "DTDC", label: "DTDC", isDisabled: false },
                  { value: "dVery", label: "dVery", isDisabled: false },
                  { value: "expb", label: "XpressBees", isDisabled: false },
                  { value: "ALL", label: "All", isDisabled: false },
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
          <div className="mt-[20px] flex items-center justify-between">
            <LoadingButton
              loading={r9ReportLoading}
              loadingPosition="start"
              startIcon={<Icons.search fontSize="small" />}
              variant="contained"
              onClick={() => {
                setIsWrongDevice(false);
                if (!dateRange.from && !dateRange.to) {
                  showToast("Please select a date range", "error");
                } else if (!partner) {
                  showToast("Please select a partner", "error");
                } else {
                  setCurrentPage(1); // Reset to first page on new search
                  dispatch(
                    getr9Report({
                      from: dayjs(dateRange.from).format("YYYY-MM-DD"),
                      to: dayjs(dateRange.to).format("YYYY-MM-DD"),
                      partner: partner,
                      page: 1,
                      limit: pageSize,
                    })
                  );
                }
              }}
            >
              Search
            </LoadingButton>
            <LoadingButton
              disabled={!isConnected}
              onClick={handleExport}
              variant="contained"
              color="primary"
              style={{
                borderRadius: "50%",
                width: 40,
                height: 40,
                minWidth: 0,
                padding: 0,
              }}
              size="small"
              sx={{ zIndex: 1 }}
            >
              <Icons.download />
            </LoadingButton>
          </div>
        </div>
        <div>
          <div className="text-[20px] font-bold text-center">
            Wrong Device Report
          </div>
          <div className="flex flex-col   gap-[20px] p-[20px]   mt-[20px] overflow-hidden">
            <div>
              <RangePicker
                required
                placement="bottomRight"
                className="w-full h-[50px] border-[2px] rounded-sm"
                format="DD-MM-YYYY"
                disabledDate={(current) => current && current > dayjs()}
                placeholder={["Start date", "End Date"]}
                value={
                  reportDate.from && reportDate.to
                    ? [reportDate.from, reportDate.to]
                    : null
                }
                onChange={(range: [Dayjs | null, Dayjs | null] | null) => {
                  if (range) {
                    setReportDate({ from: range[0], to: range[1] });
                  } else {
                    setReportDate({ from: null, to: null });
                  }
                }}
                presets={rangePresets}
              />
            </div>

            <div className="flex flex-col gap-[20px] ">
              <FormControl fullWidth>
                <Select
                  value={wrongDevicePartner}
                  defaultValue="eCOM"
                  onChange={(e) => setWrongDevicePartner(e.target.value)}
                >
                  {[
                    { value: "eKart", label: "eKart", isDisabled: false },
                    { value: "eCOM", label: "eCOM", isDisabled: false },
                    { value: "DTDC", label: "DTDC", isDisabled: false },
                    { value: "dVery", label: "Delhivery", isDisabled: false },
                    { value: "expb", label: "XpressBees", isDisabled: false },
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
              {(reportDate.from || reportDate.to) && (
                <div className="flex items-center justify-between">
                  <LoadingButton
                  disabled={!isConnected}
                    className="max-w-max"
                    variant="contained"
                    loading={wrongDeviceReportLoading}
                    onClick={() => {
                      if (wrongDevicePartner) {
                        setIsWrongDevice(true);
                        dispatch(
                          getWrongDeviceReport({
                            type: wrongDevicePartner,
                            from: dayjs(reportDate.from).format("DD-MM-YYYY"),
                            to: dayjs(reportDate.to).format("DD-MM-YYYY"),
                            page: currentPage,
                            limit: 20,
                          })
                        ).then((response: any) => {
                          if (response.payload?.data?.success) {
                          }
                        });
                      } else {
                        showToast("Please enter Partner", "error");
                      }
                    }}
                    startIcon={<Icons.search fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
                  <MuiTooltip title="Download" placement="right">
                    <LoadingButton
                      // disabled={!r6Report}
                      variant="contained"
                      color="primary"
                      style={{
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        minWidth: 0,
                        padding: 0,
                      }}
                      onClick={() => exportWrongDeviceData()}
                      size="small"
                      sx={{ zIndex: 1 }}
                    >
                      <Icons.download fontSize="small" />
                    </LoadingButton>
                  </MuiTooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        {isWrongDevice ? (
          <WrongDeviceTable
            handlePageChange={handleWrongDevicePageChange}
            handlePageSizeChange={handleWrongDevicePageSizeChange}
            pageSize={pageSize}
          />
        ) : (
          <R9ReportTable
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
          />
        )}
      </div>
    </div>
  );
};

export default R9Report;
