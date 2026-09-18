import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const AwbscanTable: React.FC<Props> = ({ gridRef }) => {
  const { awbscanreport, awbscanreportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  const columnDefs = useMemo<ColDef[]>(() => {
    const columns: string[] = awbscanreport?.columns || [];
    if (!columns.length) return [];

    const cols: ColDef[] = [
      {
        headerName: "#",
        sortable: false,
        filter: false,
        width: 100,
        valueGetter: (params) =>
          params.node?.rowPinned ? "" : (params.node?.rowIndex ?? 0) + 1,
      },
    ];

    columns.forEach((col) => {
      if (col === "product") {
        cols.push({
          headerName: "Product",
          field: "product",
          sortable: true,
          filter: true,
          width: 260,
        });
      } else if (col === "total") {
        cols.push({
          headerName: "Total",
          field: "total",
          sortable: true,
          filter: true,
          width: 150,
          headerClass: "ag-right-aligned-header",
          cellStyle: { textAlign: "right", fontWeight: 600 },
        });
      } else {
        cols.push({
          headerName: col,
          field: col,
          sortable: true,
          filter: true,
          width: 150,
          headerClass: "ag-right-aligned-header",
          cellStyle: { textAlign: "right" },
        });
      }
    });

    return cols;
  }, [awbscanreport?.columns]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      sortable: true,
      resizable: true,
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

  const pinnedBottomRowData = useMemo(() => {
    const columns: string[] = awbscanreport?.columns || [];
    const data: any[] = awbscanreport?.data || [];
    if (!columns.length || !data.length) return [];

    const totals: Record<string, any> = { product: "Grand Total" };
    columns.forEach((col) => {
      if (col === "product") return;
      totals[col] = data.reduce(
        (sum, row) => sum + (Number(row[col]) || 0),
        0,
      );
    });

    return [totals];
  }, [awbscanreport]);

  return (
    <div>
      <div className="relative ag-theme-quartz workers-report-grid awb-report-grid h-[calc(100vh-150px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={awbscanreportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          suppressMenuHide={true}
          rowData={awbscanreport?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          sideBar={sideBar}
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

export default AwbscanTable;
