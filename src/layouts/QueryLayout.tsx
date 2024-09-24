import QueryNavSlider from "@/components/shared/QueryNavSlider";
import React from "react";

type Props = {
  children: React.ReactNode;
};
const QueryLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <QueryNavSlider />
      <div className="h-[calc(100vh-85px)]">{children}</div>
    </div>
  );
};

export default QueryLayout;
