import React from "react";
import { useSearchParams } from "react-router-dom";
import Deviceinreport from "./Deviceinreport";
import R2Report from "./R2Report";
import R3Report from "./R3Report";

const Report: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reportNumber = searchParams.get("reportno");
  console.log(reportNumber);
  if (reportNumber === "R1") {
    return <Deviceinreport />;
  }
  if (reportNumber === "R2") {
    return <R2Report />;
  }
  if (reportNumber === "R3") {
    return <R3Report />;
  }
  return <div>this is {reportNumber} Report</div>;
};

export default Report;
