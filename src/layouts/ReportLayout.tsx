import Navslider from "@/components/shared/Navslider";
import React from "react";

type Props = {
  children: React.ReactNode;
};
const ReportLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Navslider />
      <div className="h-[calc(100vh-85px)]">{children}</div>
    </div>
  );
};

export default ReportLayout;
