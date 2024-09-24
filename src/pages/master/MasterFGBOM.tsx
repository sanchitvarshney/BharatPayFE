import MasterFGBOMEditDrawer from "@/components/Drawers/master/MasterFGBOMEditDrawer";
import MasterFGBOMViewDrawer from "@/components/Drawers/master/MasterFGBOMViewDrawer";
import MasterFgBOMTable from "@/table/master/MasterFgBOMTable";
import React, { useState } from "react";

const MasterFGBOM: React.FC = () => {
  const [viewProduct, setViwProduct] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<boolean>(false);
  return (
    <>
      <MasterFGBOMViewDrawer open={viewProduct} setOpen={setViwProduct} />
      <MasterFGBOMEditDrawer open={editProduct} setOpen={setEditProduct} />
      <div className="h-[calc(100vh-100px)] grid">
        <div>
          <MasterFgBOMTable setEdit={setEditProduct} setView={setViwProduct} />
        </div>
      </div>
    </>
  );
};

export default MasterFGBOM;
