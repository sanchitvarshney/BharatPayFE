import React from "react";
import { useParams } from "react-router-dom";
import DeviceQuery from "./DeviceQuery";
import Q2Statement from "./Q2Statement";
import Q3query from "./Q3query";
import Q4query from "./Q4query";
import Q5Report from "./Q5Report";
import Q6Statement from "./Q6Statement";

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
  if (id === "Q4") {
    return <Q4query />;
  }
  if (id === "Q5") {
    return <Q5Report />;
  }
  if (id === "Q6") {
    return <Q6Statement />;
  }
  return <div>this is {id} query</div>;
};

export default Query;
