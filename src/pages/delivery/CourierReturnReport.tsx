import React, { useCallback, useMemo, useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import LoadingButton from "@mui/lab/LoadingButton";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { showToast } from "@/utils/toasterContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { DELIVERY_PARTNERS } from "@/constants/deliveryPartners";
import { getCourierReturnReport } from "@/features/delivery/deliverySlice";
import type { CourierReturnRow } from "@/features/delivery/deliveryType";

const { RangePicker } = DatePicker;



const CourierReturnReport: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { courierReturnList, courierReturnLoading } = useAppSelector((state) => state.delivery);

  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [deliveryPartner, setDeliveryPartner] = useState<string>("");

  const gridRef = useRef<AgGridReact<CourierReturnRow>>(null);

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    setDate({ from: range?.[0] ?? null, to: range?.[1] ?? null });
  };

  const onBtExport = useCallback(() => {
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "Courier Return Report",
      fileName: `CourierReturnReport_${dayjs().format("DD-MM-YYYY_HH-mm")}.xlsx`,
      allColumns: true,
    });
  }, []);

  const handleSearch = () => {
    if (!date.from || !date.to) {
      showToast("Please select a date", "error");
      return;
    }
    dispatch(
      getCourierReturnReport({
        from: date.from.format("DD-MM-YYYY"),
        to: date.to.format("DD-MM-YYYY"),
        ...(deliveryPartner && { deliveryPartner }),
      })
    );
  };

  const columnDefs = useMemo<any[]>(
    () => [
      {
        headerName: "#",
        field: "id",
        width: 100,
        valueGetter: "node.rowIndex+1",
      },
      { headerName: "AWB", field: "awb", sortable: true, filter: true, flex: 1 },
      {
        headerName: "Delivery Partner",
        field: "deliveryPartner",
        sortable: true,
        filter: true,
        flex: 1,
      },
      { headerName: "Remark", field: "remark", sortable: true, filter: true, flex: 1 },
      {
        headerName: "Insert Date",
        field: "insertDate",
        sortable: true,
        filter: true,
        flex: 1,
        valueFormatter: (params: any) =>
          params.value ? dayjs(params.value).format("DD-MM-YYYY HH:mm") : "",
      },
      { headerName: "Insert By", field: "insertedBy", sortable: true, filter: true, flex: 1 },
    
      {
        headerName: "Action",
        field: "action",
        flex: 1,
        cellRenderer: (params: any) => (
          <div className="flex gap-[10px] items-center">
            <Button
              variant="secondary"
              disabled={!params.data?.videoKey}
              onClick={() => {
                if (params.data?.videoKey) window.open(params.data?.videoUrl, "_blank", "noopener,noreferrer");
              }}
            >
              <Icons.view />
              <span className="ml-1">View Video</span>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-white h-[calc(100vh-100px)] flex relative">
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
            {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
          </Button>
        </div>
        <div className="flex  gap-[20px] flex-col   p-[20px] overflow-hidden mt-[20px]">
          <RangePicker
            className="w-full h-[55px] border-2 border-neutral-300 rounded-0 "
            presets={rangePresets}
            onChange={handleDateChange}
            disabledDate={(current) => current && current > dayjs()}
            placeholder={["Start date", "End Date"]}
            value={date.from && date.to ? [date.from, date.to] : null}
            format="DD/MM/YYYY"
          />

          <FormControl fullWidth>
            <InputLabel id="courier-partner-label">Delivery Partner</InputLabel>
            <Select
              labelId="courier-partner-label"
              label="Delivery Partner"
              value={deliveryPartner}
              onChange={(e) => setDeliveryPartner(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {DELIVERY_PARTNERS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex justify-between items-center">
            <LoadingButton
              loading={courierReturnLoading}
              variant="contained"
              startIcon={<Icons.search fontSize="small" />}
              loadingPosition="start"
              onClick={handleSearch}
            >
              Search
            </LoadingButton>
            <MuiTooltip title="Download" placement="right">
              <LoadingButton
                variant="contained"
                disabled={!courierReturnList?.length}
                onClick={onBtExport}
                color="primary"
                style={{
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  minWidth: 0,
                  padding: 0,
                }}
                size="small"
                sx={{ zIndex: 1 }}
              >
                <Icons.download fontSize="small" />
              </LoadingButton>
            </MuiTooltip>
          </div>
        </div>
      </div>
      <div className="w-full relative ag-theme-quartz h-[calc(100vh-105px)] ">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={courierReturnLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={courierReturnList ?? []}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={100}
          enableCellTextSelection
        />
      </div>
    </div>
  );
};

export default CourierReturnReport;
