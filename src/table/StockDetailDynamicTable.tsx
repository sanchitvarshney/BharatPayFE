import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";

type StockDetailDynamicTableProps = {
  data: {
    productName: string;
    productSKU: string;
    openingBalance: string;
    totalIn: string;
    totalOut: string;
    closingBalance: string;
  }[];
};

const StockDetailDynamicTable: React.FC<StockDetailDynamicTableProps> = ({
  data,
}) => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
    };
  }, []);
  const formatHeaderName = (key: string): string => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };
  useEffect(() => {
    setRowData(data);
    const dynamicColumnDefs: ColDef[] = Object.keys(data[0]).map((key) => ({
      field: key,
      headerName: formatHeaderName(key),
      sortable: true,
      filter: true,
      resizable: true,
    }));
    setColumnDefs(dynamicColumnDefs);
  }, []);

  return (
    <div className="ag-theme-quartz ">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={false}
        paginationPageSize={10}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default StockDetailDynamicTable;
