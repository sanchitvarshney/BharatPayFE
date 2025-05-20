import React, { useCallback, useMemo, useState } from "react";

import dayjs, { Dayjs } from "dayjs";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getListofPo } from "@/features/procurement/poSlices";
import CustomPagination from "@/components/reusable/CustomPagination";
import { AgGridReact } from "@ag-grid-community/react";

import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";

import { showToast } from "@/utils/toasterContext";

import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";

import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import RangeSelect from "@/components/reusable/antSelecters/RangeSelect";
import { setDateRange } from "@/features/procurement/poSlices";
const ManagePO: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useAppDispatch();
  const { managePoData, loading, dateRange } = useAppSelector(
    (state) => state.po
  );
  const [colapse, setcolapse] = useState<boolean>(false);
  const [type, setType] = useState<string>("datewise");
  //   const [detail, setDetail] = useState<boolean>(false);
  const [po, setPo] = useState<string>("");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });

  // console.log("managePoData", managePoData);
  //   const dispatch = useAppDispatch();

  //   const gridRef = useRef<AgGridReact<any>>(null);

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: "node.rowIndex+1",
    },
    {
      headerName: "PO No.",
      field: "po_transaction",
      sortable: true,
      filter: true,
    },

    {
      headerName: "Vendor Id",
      field: "vendor_id",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Vendor Name",
      field: "vendor_name",
      sortable: true,
      filter: true,
    },

    {
      headerName: "Advance Payment",
      field: "advancePayment",
      sortable: true,
      filter: true,
    },
    {
      headerName: "PO Created Date",
      field: "po_reg_date",
      sortable: true,
      filter: true,
    },
    {
      headerName: "PO Created By",
      field: "po_reg_by",
      sortable: true,
      filter: true,
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      console.log("handlePageChange", dateRange);
      // if (!dateRange) {
      //   console.log("no date range");
      //   return;
      // }

      setCurrentPage(page);
      dispatch(
        getListofPo({
          wise: type,
          data: dateRange,
          page: page,
          limit: pageSize,
        })
      );
    },
    [dispatch, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
      if (dateRange) {
        dispatch(
          getListofPo({
            wise: type,
            data: dateRange,
            page: currentPage,
            limit: size,
          })
        );
      }
    },
    [dispatch]
  );
  const handleDateChange = (dates: {
    from: Dayjs | null;
    to: Dayjs | null;
  }) => {
    setDate(dates);
  };

  const handleExport = () => {
    console.log("DownloadReport");
    //   if (!dateRange || !date) {
    //     return showToast("Please select location and date range", "error");
    //   }
    //   const reportPayload = {
    //     partner: partner,
    //     fromDate: dateRange.from?.format("DD-MM-YYYY"),
    //     toDate: dateRange.to?.format("DD-MM-YYYY"),
    //   };
    //   swipeMachineInward(reportPayload);
    //   showToast("Start downloading ", "success");
  };
  console.log("date range", dateRange);

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
        <div className="overflow-x-hidden overflow-y-auto ">
          <div className="flex items-center gap-[10px] p-[10px]  mt-[20px]">
            <FormControl fullWidth>
              <Select
                value={type}
                defaultValue="min"
                onChange={(e) => setType(e.target.value)}
              >
                {[
                  { value: "powise", label: "PO", isDisabled: false },
                  { value: "datewise", label: "Date", isDisabled: false },
                  { value: "vendorwise", label: "Vender", isDisabled: false },
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
            {type === "powise" ? (
              <div className="flex flex-col gap-[20px] ">
                <TextField
                  label="PO"
                  value={po}
                  onChange={(e) => setPo(e.target.value)}
                />

                <div className="flex items-center justify-between">
                  <LoadingButton
                    className="max-w-max"
                    variant="contained"
                    loading={loading}
                    onClick={() => {
                      if (po) {
                        dispatch(
                          getListofPo({
                            wise: "powise",
                            data: po,
                            limit: pageSize,
                            page: 1,
                          })
                        );
                      } else {
                        showToast("Please enter PO", "error");
                      }
                    }}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
                  <MuiTooltip title="Download" placement="right">
                    <LoadingButton
                      // disabled={!mainR1Report}
                      variant="contained"
                      color="primary"
                      style={{
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        minWidth: 0,
                        padding: 0,
                      }}
                      onClick={handleExport}
                      size="small"
                      sx={{ zIndex: 1 }}
                    >
                      <Icons.download />
                    </LoadingButton>
                  </MuiTooltip>
                </div>
              </div>
            ) : type === "datewise" ? (
              <div className="flex flex-col gap-[20px] ">
                <RangeSelect
                  value={date}
                  onChange={handleDateChange}
                  disabledDate={(current) => {
                    return current ? current > dayjs() : false;
                  }}
                  format="DD/MM/YYYY"
                  presets={rangePresets}
                  placeholder={["Start Date", "End Date"]}
                />
                <div className="flex justify-between">
                  <LoadingButton
                    loadingPosition="start"
                    onClick={() => {
                      if (!date.from || !date.to) {
                        showToast("Please select date range", "error");
                      } else {
                        let dataString = "";

                        const startDate = dayjs(date.from).format("DD-MM-YYYY");
                        const endDate = dayjs(date.to).format("DD-MM-YYYY");
                        dataString = `${startDate}-${endDate}`;
                        dispatch(setDateRange(dataString as any));

                        dispatch(
                          getListofPo({
                            wise: "datewise",
                            //   from: dayjs(date.from).format("DD-MM-YYYY"),
                            //   to: dayjs(date.to).format("DD-MM-YYYY"),
                            data: dataString,
                            limit: pageSize,
                            page: 1,
                          })
                        );
                      }
                    }}
                    variant="contained"
                    loading={loading}
                    //   disabled={!date || mainR1ReportLoading}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
                  <MuiTooltip title="Download" placement="right">
                    <LoadingButton
                      // disabled={!mainR1Report}
                      variant="contained"
                      color="primary"
                      style={{
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        minWidth: 0,
                        padding: 0,
                      }}
                      onClick={() => {}}
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
        <div>
          <div className="relative ag-theme-quartz h-[calc(100vh-190px)]">
            <AgGridReact
              loadingOverlayComponent={CustomLoadingOverlay}
              loading={loading}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              suppressCellFocus={true}
              rowData={managePoData?.data || []}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
            />
          </div>
          <div className="p-4 border-t">
            <CustomPagination
              currentPage={currentPage}
              totalPages={managePoData?.pagination?.total_pages}
              totalRecords={managePoData?.pagination?.total}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePO;
