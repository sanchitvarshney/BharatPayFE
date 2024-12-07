import React from "react";
import { useParams } from "react-router-dom";
import Deviceinreport from "./Deviceinreport";
import R2Report from "./R2Report";
import R3Report from "./R3Report";
import R4Report from "./R4Report";
import R5report from "./R5report";
import R6Report from "./R6Report";
import R7Report from "./R7Report";

const Report: React.FC = () => {
  const { id } = useParams();

  if (id === "R1") {
    return <Deviceinreport />;
  }
  if (id === "R2") {
    return <R2Report />;
  }
  if (id === "R3") {
    return <R3Report />;
  }
  if (id === "R4") {
    return <R4Report />;
  }
  if (id === "R5") {
    return <R5report />;
  }
  if (id === "R6") {
    return <R6Report />;
  }
  if (id === "R7") {
    return <R7Report />;
  }
  return <div>this is {id} Report</div>;
};

export default Report;
