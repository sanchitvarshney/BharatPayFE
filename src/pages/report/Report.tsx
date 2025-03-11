import React from "react";
import { useParams } from "react-router-dom";
import Deviceinreport from "./Deviceinreport";
import R2Report from "./R2Report";
import R3Report from "./R3Report";
import R4Report from "./R4Report";
import R5report from "./R5report";
import R6Report from "./R6Report";
import R7Report from "./R7Report";
import R8Report from "./R8Report";
import R9Report from "./R9Report";
import R10Report from "@/pages/report/R10Report";
import R11Report from "@/pages/report/R11Report";
import R12Report from "@/pages/report/R12Report";
import R13Report from "@/pages/report/R13Report";

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
  if (id === "R8") {
    return <R8Report />;
  }
  if (id === "R9") {
    return <R9Report />;
  }
  if(id === "R10"){
    return <R10Report/>
  }
  if(id === "R11"){
    return <R11Report/>
  }
  if(id === "R12"){
    return <R12Report/>
  }
  if(id === "R13"){
    return <R13Report/>
  }
  return <div>this is {id} Report</div>;
};

export default Report;
