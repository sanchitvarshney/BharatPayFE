import React from "react";
import { useSearchParams } from "react-router-dom";
import Deviceinreport from "./Deviceinreport";
import R2Report from "./R2Report";
import R3Report from "./R3Report";
import R4Report from "./R4Report";
import R5report from "./R5report";

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
  if (reportNumber === "R4") {
    return <R4Report />;
  }
  if (reportNumber === "R5") {
    return <R5report />;
  }
  return <div>this is {reportNumber} Report</div>;
};

export default Report;
