import React, { RefObject, useCallback, useMemo } from "react";
import {
  ColDef,
  ColGroupDef,
  ExcelStyle,
  PostSortRowsParams,
} from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const FIXED_COLUMNS = ["department", "total"];

const SoundboxHourlyTable: React.FC<Props> = ({ gridRef }) => {
  const { soundboxHourlyReport, soundboxHourlyReportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => {
    const columns: string[] = soundboxHourlyReport?.columns || [];
    if (!columns.length) return [];

    const hourColumns = columns
      .filter((col) => !FIXED_COLUMNS.includes(col))
      .sort((a, b) => {
        const startA = parseInt(a.split("-")[0], 10);
        const startB = parseInt(b.split("-")[0], 10);
        return startA - startB;
      });

    const defs: (ColDef | ColGroupDef)[] = [
      // {
      //   headerName: "#",
      //   sortable: false,
      //   filter: false,
      //   width: 100,
      //   valueGetter: (params) =>
      //     params.node?.rowPinned ? "" : (params.node?.rowIndex ?? 0) + 1,
      // },
      {
        headerName: "Department",
        field: "department",
        sortable: true,
        width: 130,
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
            width: 120,
            headerClass: `ag-right-aligned-header`,
            cellStyle: { textAlign: "right" },
          };
        }),
      },
      {
        headerName: "Total",
        field: "total",
        sortable: true,
        width: 100,
        headerClass: `ag-right-aligned-header`,
        cellStyle: { textAlign: "right", fontWeight: 600 },
      },
    ];

    return defs;
  }, [soundboxHourlyReport]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: false,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      sortable: true,
      resizable: true,
      cellClassRules: {
        "grand-total-cell": (params) => !!params.data?.isGrandTotal,
      },
    };
  }, []);

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

  const rowData = useMemo(() => {
    const columns: string[] = soundboxHourlyReport?.columns || [];
    const data: any[] = soundboxHourlyReport?.data || [];
    if (!columns.length || !data.length) return data;

    const totals: Record<string, any> = {
      department: "Grand Total",
      isGrandTotal: true,
    };
    columns.forEach((col) => {
      if (FIXED_COLUMNS.includes(col) && col !== "total") return;
      totals[col] = data.reduce(
        (sum, row) => sum + (Number(row[col]) || 0),
        0,
      );
    });

    return [...data, totals];
  }, [soundboxHourlyReport]);

  // Keep the Grand Total row at the bottom when sorting
  const postSortRows = useCallback((params: PostSortRowsParams) => {
    const nodes = params.nodes;
    const index = nodes.findIndex((node) => node.data?.isGrandTotal);
    if (index > -1) {
      nodes.push(nodes.splice(index, 1)[0]);
    }
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz workers-report-grid soundbox-report-grid h-[calc(100vh-150px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={soundboxHourlyReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          excelStyles={excelStyles}
          postSortRows={postSortRows}
          getRowClass={(params) =>
            params.data?.isGrandTotal ? "wr-total-row" : undefined
          }
          pagination={false}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default SoundboxHourlyTable;
