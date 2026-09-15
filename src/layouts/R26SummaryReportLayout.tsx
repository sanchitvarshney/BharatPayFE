import SegmentedToggle from "@/components/reusable/SegmentedToggle";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setMode } from "@/features/report/report/reportSummarySlice";
import AwbscanReport from "@/pages/report/r26reports/AwbscanReport";
import QCMINQutwardReport from "@/pages/report/r26reports/QCMINQutwardReport";
import TrcHourlyReport from "@/pages/report/r26reports/TrcHourlyReport";
import SoundboxHourlyReport from "@/pages/report/r26reports/SoundboxHourlyReport";

type ViewMode = "trc" | "awb" | "qc" | "soundbox";

const R26SummaryReportLayout = () => {
  const mode = useAppSelector((state) => state.reportSummary?.mode) as ViewMode;
  const dispatch = useAppDispatch();

  const renderScreen = (mode: ViewMode) => {
    switch (mode) {
      case "awb":
        return <AwbscanReport />;
      case "qc":
        return <QCMINQutwardReport />;
      case "trc":
        return <TrcHourlyReport />;
      case "soundbox":
        return <SoundboxHourlyReport />;
      default:
        return null;
    }
  };
  return (
    <div className={`bg-white  h-[calc(100vh-100px)]  p-1 flex flex-col`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SegmentedToggle
            value={mode}
            onChange={(value) => dispatch(setMode(value as ViewMode))}
            options={[
              { value: "awb", label: "AWB Scan" },
              { value: "qc", label: "QC MIN Outward" },
              { value: "trc", label: "TRC" },
              { value: "soundbox", label: "Soundbox Hourly" },
            ]}
          />
        </div>
      </div>
      <div className="w-full h=[calc(100vh-500px)]  mt-1">
        {renderScreen(mode)}
      </div>
    </div>
  );
};

export default R26SummaryReportLayout;
