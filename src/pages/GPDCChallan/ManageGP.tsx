import React, { useCallback, useMemo, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs, { Dayjs } from "dayjs";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  getListofGPDC,
  printGPDC,
  getGPDCById,
  setDateRange,
} from "@/features/GPDCChallan/GPDCChallanSlice";
import CustomPagination from "@/components/reusable/CustomPagination";
import { AgGridReact } from "@ag-grid-community/react";

import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import {
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import RangeSelect from "@/components/reusable/antSelecters/RangeSelect";
const ManageGP: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const dispatch = useAppDispatch();
  const { manageGPDCData, printLoading, dateRange, getGPDCLoading } =
    useAppSelector((state) => state.gpdcChallan);
  const [colapse, setcolapse] = useState<boolean>(false);
  const [type, setType] = useState<string>("datewise");
  const [gpdcNo, setGpdcNo] = useState<string>("");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    rowData: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowData);
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      // pinned: "right",
      sortable: false,
      filter: false,
      cellRenderer: (params: { data: any }) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, params.data)}
          className="hover:bg-gray-100"
        >
          <MoreVertIcon className="h-4 w-4" />
        </IconButton>
      ),
      width: 50,
    },
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: "node.rowIndex+1",
    },
    {
      headerName: "GP DC No.",
      field: "gpdc_no",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Type",
      field: "type",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Recipient Name",
      field: "name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Mobile",
      field: "mobile",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created Date",
      field: "created_date",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created By",
      field: "created_by",
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
      setCurrentPage(page);
      dispatch(
        getListofGPDC({
          wise: type,
          ...(type === "gpdcwise"
            ? { txn: gpdcNo }
            : { from: dateRange?.from || "", to: dateRange?.to || "" }),
          page: page,
          limit: pageSize,
        })
      );
    },
    [dispatch, pageSize, type, dateRange, gpdcNo]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
      if (dateRange || gpdcNo) {
        dispatch(
          getListofGPDC({
            wise: type,
            ...(type === "gpdcwise"
              ? { txn: gpdcNo }
              : { from: dateRange?.from || "", to: dateRange?.to || "" }),
            page: 1,
            limit: size,
          })
        );
      }
    },
    [dispatch, type, dateRange, gpdcNo]
  );
  const handleDateChange = (dates: {
    from: Dayjs | null;
    to: Dayjs | null;
  }) => {
    setDate(dates);
  };

  const handlePrintChallan = () => {
    if (selectedRow?.gpdc_no) {
      dispatch(printGPDC({ id: selectedRow.gpdc_no })).then((res: any) => {
        if (res.payload?.success) {
          showToast("GP DC downloaded successfully", "success");
        }
      });
    }
    setAnchorEl(null);
  };

  const handleViewGPDC = () => {
    if (selectedRow?.gpdc_no) {
      dispatch(getGPDCById({ gpdcId: selectedRow.gpdc_no })).then(
        (res: any) => {
          if (res.payload?.data?.success) {
            // You can open a modal or navigate to view page here
            showToast("GP DC details loaded", "success");
          }
        }
      );
    }
    setAnchorEl(null);
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
        <div className="overflow-x-hidden overflow-y-auto ">
          <div className="flex items-center gap-[10px] p-[10px]  mt-[20px]">
            <FormControl fullWidth>
              <Select
                value={type}
                defaultValue="datewise"
                onChange={(e) => setType(e.target.value)}
              >
                {[
                  { value: "gpdcwise", label: "GP DC No.", isDisabled: false },
                  { value: "datewise", label: "Date", isDisabled: false },
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
            {type === "gpdcwise" ? (
              <div className="flex flex-col gap-[20px] ">
                <TextField
                  label="GP DC No."
                  value={gpdcNo}
                  onChange={(e) => setGpdcNo(e.target.value)}
                />

                <div className="flex items-center justify-between">
                  <LoadingButton
                    className="max-w-max"
                    variant="contained"
                    loading={getGPDCLoading}
                    onClick={() => {
                      if (gpdcNo) {
                        dispatch(
                          getListofGPDC({
                            wise: "gpdcwise",
                            txn: gpdcNo,
                            limit: pageSize,
                            page: 1,
                          })
                        );
                        setCurrentPage(1);
                      } else {
                        showToast("Please enter GP DC No.", "error");
                      }
                    }}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
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
                        const startDate = dayjs(date.from).format("DD-MM-YYYY");
                        const endDate = dayjs(date.to).format("DD-MM-YYYY");
                        dispatch(
                          setDateRange({ from: startDate, to: endDate } as any)
                        );

                        dispatch(
                          getListofGPDC({
                            wise: "datewise",
                            from: startDate,
                            to: endDate,
                            limit: pageSize,
                            page: 1,
                          })
                        );
                        setCurrentPage(1);
                      }
                    }}
                    variant="contained"
                    loading={getGPDCLoading}
                    //   disabled={!date || mainR1ReportLoading}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
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
              loading={getGPDCLoading || printLoading}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              suppressCellFocus={true}
              rowData={
                Array.isArray(manageGPDCData?.data) ? manageGPDCData.data : []
              }
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              enableCellTextSelection={true}
            />
          </div>
          <div className="p-4 border-t">
            <CustomPagination
              currentPage={currentPage}
              totalPages={manageGPDCData?.pagination?.total_pages}
              totalRecords={manageGPDCData?.pagination?.total}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleViewGPDC}>View</MenuItem>
          <MenuItem onClick={handlePrintChallan}>Download</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ManageGP;
