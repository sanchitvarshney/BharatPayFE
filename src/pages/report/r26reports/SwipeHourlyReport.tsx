import React from "react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { getSwipeHourlyReport } from "@/features/report/report/reportSummarySlice";
import DepartmentHourlyReport from "@/components/report/r26/DepartmentHourlyReport";

const SwipeHourlyReport: React.FC = () => {
  const { swipeHourlyReport, swipeHourlyReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  return (
    <DepartmentHourlyReport
      title="Swipe Hourly Report"
      description="Swipe worked count per hour for each department."
      reportName="Swipe hourly report"
      dateKey="swipeHourly"
      thunk={getSwipeHourlyReport}
      report={swipeHourlyReport}
      loading={swipeHourlyReportLoading}
      sheetName="Swipe Hourly Report"
      filePrefix="Swipe_Hourly_Report"
    />
  );
};

export default SwipeHourlyReport;
