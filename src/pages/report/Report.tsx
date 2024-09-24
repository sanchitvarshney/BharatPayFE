import React from "react";
import { useSearchParams } from "react-router-dom";
import Deviceinreport from "./Deviceinreport";

const Report: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reportNumber = searchParams.get("reportno");
  console.log(reportNumber);
  if (reportNumber === "R1") {
    return <Deviceinreport />;
  }
  return <div>this is {reportNumber} Report</div>;
};

export default Report;
