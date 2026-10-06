import React from "react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { getSoundboxHourlyReport } from "@/features/report/report/reportSummarySlice";
import DepartmentHourlyReport from "@/components/report/r26/DepartmentHourlyReport";

const SoundboxHourlyReport: React.FC = () => {
  const { soundboxHourlyReport, soundboxHourlyReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  return (
    <DepartmentHourlyReport
      title="Soundbox Hourly Report"
      description="Soundbox worked count per hour for each department."
      reportName="Soundbox hourly report"
      dateKey="soundboxHourly"
      thunk={getSoundboxHourlyReport}
      report={soundboxHourlyReport}
      loading={soundboxHourlyReportLoading}
      sheetName="Soundbox Hourly Report"
      filePrefix="Soundbox_Hourly_Report"
    />
  );
};

export default SoundboxHourlyReport;
