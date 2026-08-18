import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "antd";
import { LoadingButton } from "@mui/lab";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { rangePresets } from "@/utils/rangePresets";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { useSocketContext } from "@/components/context/SocketContext";
import SelectMultipleLocations from "@/components/reusable/SelectMultipleLocations";
import SelectMultipleComponentsDrawer from "@/components/reusable/SelectMultipleComponentsDrawer";
import { ComponentType } from "@/components/reusable/SelectComponent";
import RawMaterialReportTable from "@/table/materialReport/RawMaterialReportTable";
import ProgressWithParcentage from "@/components/reusable/ProgressWithParcentage";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/reusable/CustomModal";
import {
  fetchRawMaterialLocations,
  getRawMaterialReport,
  RawMaterialLocationType,
} from "@/features/rawMaterialReport/rawMaterialReportSlice";

const { RangePicker } = DatePicker;

const RAW_MATERIAL_REPORT_FILTERS_KEY = "rawMaterialReportFilters";

type StoredRawMaterialReportFilters = {
  locations: RawMaterialLocationType[];
  components: ComponentType[];
  dateRange: [string, string] | null;
};

const loadStoredFilters = (): StoredRawMaterialReportFilters | null => {
  try {
    const raw = localStorage.getItem(RAW_MATERIAL_REPORT_FILTERS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const RawMaterialReport: React.FC = () => {
  const storedFilters = loadStoredFilters();

  const [colapse, setcolapse] = useState<boolean>(false);
  const [locations, setLocations] = useState<RawMaterialLocationType[]>(
    storedFilters?.locations ?? [],
  );
  const [components, setComponents] = useState<ComponentType[]>(
    storedFilters?.components ?? [],
  );
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(
    storedFilters?.dateRange
      ? [dayjs(storedFilters.dateRange[0]), dayjs(storedFilters.dateRange[1])]
      : null,
  );
  const [progressOpen, setProgressOpen] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const dispatch = useAppDispatch();
  const { locationList, locationListLoading, reportData, reportLoading } =
    useAppSelector((state) => state.rawMaterialReport);
  const { emitDownloadRawMaterialReport, isConnected, onDownloadReport, off } =
    useSocketContext();

  const handleDownload = () => {
    if (!isConnected) {
      showToast("You are not connected to the server", "error");
      return;
    }
    emitDownloadRawMaterialReport({
      fromDate: dayjs(dateRange?.[0])?.format("DD-MM-YYYY"),
      toDate: dayjs(dateRange?.[1])?.format("DD-MM-YYYY"),
      locations: locations.map((item) => item.code ?? ""),
      components: components.map((item) => item.id ?? ""),
    });
  };

  useEffect(() => {
    dispatch(fetchRawMaterialLocations());
  }, [dispatch]);

  useEffect(() => {
    const filters: StoredRawMaterialReportFilters = {
      locations,
      components,
      dateRange:
        dateRange && dateRange[0] && dateRange[1]
          ? [dateRange[0].toISOString(), dateRange[1].toISOString()]
          : null,
    };
    localStorage.setItem(
      RAW_MATERIAL_REPORT_FILTERS_KEY,
      JSON.stringify(filters),
    );
  }, [locations, components, dateRange]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(RAW_MATERIAL_REPORT_FILTERS_KEY);
    };
  }, []);

  useEffect(() => {
    const handleProgress = (data: {
      notificationId: string;
      percent: string;
    }) => {
      const percent = Number(data.percent) || 0;
      setProgressPercent(percent);
      if (percent >= 100) {
        setTimeout(() => {
          dispatch(
            getRawMaterialReport({
              fromDate: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
              toDate: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
              locations: locations.map((item) => item.code ?? ""),
              components: components.map((item) => item.id ?? ""),
            }),
          );
          setProgressOpen(false);
        }, 1000);
      }
    };

    onDownloadReport(handleProgress);
    return () => off("progress");
  }, [onDownloadReport, off, dateRange, locations, components]);

  const handleSearch = async () => {
    if (!locations.length) {
      showToast("Please select at least one location", "error");
      return;
    }
    if (!components.length) {
      showToast("Please select at least one component", "error");
      return;
    }
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      showToast("Please select date range", "error");
      return;
    }

    try {
      const result = await dispatch(
        getRawMaterialReport({
          fromDate: dayjs(dateRange[0]).format("DD-MM-YYYY"),
          toDate: dayjs(dateRange[1]).format("DD-MM-YYYY"),
          locations: locations.map((item) => item.code ?? ""),
          components: components.map((item) => item.id ?? ""),
        }),
      ).unwrap();
      if (!result?.data?.success && result?.data?.status === "error") {
        setProgressPercent(0);
        setProgressOpen(true);
        handleDownload();
      }
    } catch (error) {
      showToast("Failed to fetch raw material report", "error");
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] bg-white relative">
      <Modal open={progressOpen} onOpenChange={() => {}}>
        <ModalContent
          className="max-w-sm"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <ModalHeader>
            <ModalTitle>Generating Report</ModalTitle>
            <ModalDescription>
              Please wait while we prepare your raw material report.
            </ModalDescription>
          </ModalHeader>
          <ProgressWithParcentage value={progressPercent} />
        </ModalContent>
      </Modal>
      <div className="h-full flex">
        <div
          className={`transition-all h-full ${colapse ? "min-w-0 max-w-0" : "min-w-[380px] max-w-[380px]"} overflow-y-auto overflow-x-hidden border-r border-neutral-400/70,`}
        >
          <div
            className={`transition-all ${colapse ? "left-0" : "left-[380px]"} w-[16px] p-0 h-full top-0 bottom-0 absolute rounded-none text-slate-600 z-[10] flex items-center justify-center`}
          >
            <Button
              onClick={() => setcolapse(!colapse)}
              className="transition-all w-[16px] p-0 py-[35px] bg-neutral-200 rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300"
            >
              {colapse ? (
                <Icons.right fontSize="small" />
              ) : (
                <Icons.left fontSize="small" />
              )}
            </Button>
          </div>
          <div className="p-[20px] flex flex-col gap-[24px]">
            <SelectMultipleLocations
              label="Select Location"
              options={locationList}
              loading={locationListLoading}
              value={locations}
              onChange={setLocations}
            />

            <div>
              <SelectMultipleComponentsDrawer
                label="Select Component"
                value={components}
                onChange={setComponents}
              />
            </div>

            <div>
              <RangePicker
                placement="bottomRight"
                className="w-full h-[50px]"
                format="DD-MM-YYYY"
                placeholder={["From Date", "To Date"]}
                disabledDate={(current) =>
                  !!current && current > dayjs().endOf("day")
                }
                value={dateRange}
                onChange={(dates) =>
                  setDateRange(dates as [Dayjs | null, Dayjs | null] | null)
                }
                presets={rangePresets}
              />
            </div>

            <LoadingButton
              loadingPosition="start"
              loading={reportLoading || progressOpen}
              onClick={handleSearch}
              startIcon={<Icons.search fontSize="small" />}
              variant="contained"
            >
              Search
            </LoadingButton>
          </div>
        </div>

        <div className="w-full min-w-0">
          {reportData ? (
            <RawMaterialReportTable />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <img src="/search.webp" alt="" className="w-[300px] opacity-50" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RawMaterialReport;
