import React, { RefObject, useMemo } from "react";
import { ColDef, ColGroupDef, ExcelStyle } from "@ag-grid-community/core";
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
      filter: "agTextColumnFilter",
      floatingFilter: false,
      sortable: true,
      resizable: true,
      cellClassRules: {
        "grand-total-cell": (params) => params.node.rowPinned === "bottom",
      },
    };
  }, []);

  const sideBar = useMemo(
    () => ({
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressPivotMode: true,
            suppressPivots: true,
          },
        },
      ],
      defaultToolPanel: "",
    }),
    [],
  );

  const excelStyles = useMemo<ExcelStyle[]>(
    () => [
      {
        id: "header",
        interior: {
          color: "#305496",
          pattern: "Solid",
        },
        font: {
          color: "#FFFFFF",
          bold: true,
        },
        alignment: {
          horizontal: "Center",
        },
      },
      {
        id: "grand-total-cell",
        interior: {
          color: "#FFFF00",
          pattern: "Solid",
        },
        font: {
          bold: true,
        },
      },
    ],
    [],
  );

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

  return (
    <div>
      <div className="relative ag-theme-quartz workers-report-grid trc-report-grid h-[calc(100vh-150px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={trcHourlyReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          suppressMenuHide={true}
          rowData={trcHourlyReport?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          sideBar={sideBar}
          excelStyles={excelStyles}
          pinnedBottomRowData={pinnedBottomRowData}
          getRowClass={(params) =>
            params.node?.rowPinned === "bottom" ? "wr-total-row" : undefined
          }
          pagination={true}
          paginationPageSize={50}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default TrcHourlyTable;
