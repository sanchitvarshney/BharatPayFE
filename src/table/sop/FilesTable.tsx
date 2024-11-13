import React from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import styled from "styled-components";

const FilesTable: React.FC = () => {
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "ID",
      valueGetter: "node.rowIndex + 1",
      width: 100,
    },
    {
      headerName: "Name",
      field: "name",

      flex: 1,
    },
    {
      headerName: "Type",
      field: "type",

      flex: 1,
    },
    {
      headerName: "Upload Date",
      field: "type",

      flex: 1,
    },
    {
      headerName: "Actions",
      field: "type",
      flex: 1,
    },
  ];

  return (
    <Wrapper>
      <div className="ag-theme-quartz h-[calc(100vh-110px)]">
        <AgGridReact loading={false} loadingOverlayComponent={CustomLoadingOverlay} suppressCellFocus={true} overlayNoRowsTemplate={OverlayNoRowsTemplate} columnDefs={columnDefs} pagination={true} paginationPageSize={50} loadingCellRenderer="customLoadingCellRenderer" />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ag-theme-quartz .ag-header {
    font-family: cursive;
    background-color: #fff;
  }
`;
export default FilesTable;
