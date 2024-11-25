import React from "react";
import { useParams } from "react-router-dom";
import DeviceQuery from "./DeviceQuery";
import Q2Statement from "./Q2Statement";
import Q3query from "./Q3query";

const Query: React.FC = () => {
  const { id } = useParams();

  if (id === "Q1") {
    return <DeviceQuery />;
  }
  if (id === "Q2") {
    return <Q2Statement />;
  }
  if (id === "Q3") {
    return <Q3query />;
  }
  return <div>this is {id} query</div>;
};

export default Query;
