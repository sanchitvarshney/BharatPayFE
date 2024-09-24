import React from "react";
import { useSearchParams } from "react-router-dom";
import DeviceQuery from "./DeviceQuery";

const Query: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryNumber = searchParams.get("query");
  if (queryNumber === "Q1") {
    return <DeviceQuery />;
  }
  return <div>this is {queryNumber} query</div>;
};

export default Query;
