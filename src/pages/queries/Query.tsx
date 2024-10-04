import React from "react";
import { useSearchParams } from "react-router-dom";
import DeviceQuery from "./DeviceQuery";
import Q2Statement from "./Q2Statement";

const Query: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryNumber = searchParams.get("query");
  if (queryNumber === "Q1") {
    return <DeviceQuery />;
  }
  if (queryNumber === "Q2") {
    return <Q2Statement />;
  }
  return <div>this is {queryNumber} query</div>;
};

export default Query;
