// import NotPermissionPage from "@/pages/commonPages/NotPermissionPage";
import UnderConstructionPage from "@/pages/commonPages/UnderConstructionPage";
import React from "react";

type Props = {
  children: React.ReactNode;
  UnderDevelopment?: boolean;
};
const CustomRedirection: React.FC<Props> = ({ UnderDevelopment=false, children }) => {
  return <div>{UnderDevelopment ? <UnderConstructionPage /> : children}</div>;
};

export default CustomRedirection;
