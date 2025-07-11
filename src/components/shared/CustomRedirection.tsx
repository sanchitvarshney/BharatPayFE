import NotPermissionPage from "@/pages/commonPages/NotPermissionPage";

import React from "react";

type Props = {
  children: React.ReactNode;
  UnderDevelopment?: boolean;
};
const CustomRedirection: React.FC<Props> = ({ UnderDevelopment = false, children }) => {
  return <div>{UnderDevelopment ? <NotPermissionPage /> : children}</div>;
};

export default CustomRedirection;
