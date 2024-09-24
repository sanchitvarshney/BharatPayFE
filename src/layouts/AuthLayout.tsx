import React from "react";

function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-[100vh] bg-zinc-100 ">
      <div className="flex items-center justify-center py-12 bg-no-repeat">{props.children}</div>
      <div className="hidden lg:block bg-[url(/logn.svg)] bg-contain bg-no-repeat"></div>
    </div>
  );
}
export default AuthLayout;
