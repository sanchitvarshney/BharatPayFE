import React, { RefObject, useMemo } from "react";
import { ColDef, ColGroupDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const FIXED_COLUMNS = ["empCode", "department", "total"];

const TrcHourlyTable: React.FC<Props> = ({ gridRef }) => {
  const { trcHourlyReport, trcHourlyReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => {
    const columns: string[] = trcHourlyReport?.columns || [];
    if (!columns.length) return [];

    const hourColumns = columns
      .filter((col) => !FIXED_COLUMNS.includes(col))
      .sort((a, b) => {
        const startA = parseInt(a.split("-")[0], 10);
        const startB = parseInt(b.split("-")[0], 10);
        return startA - startB;
      });

    const defs: (ColDef | ColGroupDef)[] = [
      {
        headerName: "#",
        sortable: false,
        filter: false,
        width: 100,
        valueGetter: (params) =>
          params.node?.rowPinned ? "" : (params.node?.rowIndex ?? 0) + 1,
      },
      {
        headerName: "Emp Code",
        field: "empCode", 
        sortable: true,
        filter: true,
        width: 180,
   
      },
   
      {
        headerName: "Worked (Hourly)",
       width: 400,
        headerClass: `center-header `,
        suppressStickyLabel: true,
        children: hourColumns.map((col) => {
          return {
            headerName: col,
            field: col,
            sortable: true,
            filter: true,
            width: 160,
            headerClass: `ag-right-aligned-header`,
            cellStyle: { textAlign: "right" },
          };
        }),
      },
      {
        headerName: "Total",
        field: "total",
        sortable: true,
        filter: true,
        width: 130,
        headerClass: `ag-right-aligned-header`,
        cellStyle: { textAlign: "right", fontWeight: 600 },
      },
    ];

    return defs;
  }, [trcHourlyReport]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const pinnedBottomRowData = useMemo(() => {
    const columns: string[] = trcHourlyReport?.columns || [];
    const data: any[] = trcHourlyReport?.data || [];
    if (!columns.length || !data.length) return [];

    const totals: Record<string, any> = { empCode: "Grand Total" };
    columns.forEach((col) => {
      if (FIXED_COLUMNS.includes(col) && col !== "total") return;
      totals[col] = data.reduce(
        (sum, row) => sum + (Number(row[col]) || 0),
        0,
      );
    });

    return [totals];
  }, [trcHourlyReport]);

  const getRowStyle = (params: any) => {
    if (params.node.rowPinned) {
      return { backgroundColor: "#ffff00", fontWeight: 600 };
    }
    return undefined;
  };

  return (
    <div>
      <div className="relative ag-theme-quartz workers-report-grid h-[calc(100vh-150px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={trcHourlyReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={trcHourlyReport?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pinnedBottomRowData={pinnedBottomRowData}
          getRowStyle={getRowStyle}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default TrcHourlyTable;
