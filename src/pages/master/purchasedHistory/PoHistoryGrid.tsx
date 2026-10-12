import React, { useMemo, useState } from "react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./poHistory.grid.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { InputAdornment, TextField } from "@mui/material";
import InventoryOutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchIcon from "@mui/icons-material/Search";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import {
  PoHistoryFilterType,
  PoHistoryGroup,
} from "@/features/master/componentPercentage/componentPercentageType";
import {
  detailColumnDefs,
  gridDefaultColDef,
  masterColumnDefs,
} from "./poHistory.columns";
import {
  DETAIL_ROW_HEIGHT,
  detailRowHeight,
} from "./poHistory.constants";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  MenuModule,
]);

const groupRowId = (group: PoHistoryGroup) =>
  group.component?.component_key ??
  group.vendor?.vendor_id ??
  group.purchase_history?.[0]?.po_transaction ??
  "";

type Props = {
  groups: PoHistoryGroup[];
  gridMode: PoHistoryFilterType;
  loading: boolean;
  hasSearched: boolean;
  totalPurchaseOrders: number;
};

const PoHistoryGrid: React.FC<Props> = ({
  groups,
  gridMode,
  loading,
  hasSearched,
  totalPurchaseOrders,
}) => {
  const [quickFilter, setQuickFilter] = useState("");

  const columnDefs = useMemo(() => masterColumnDefs(gridMode), [gridMode]);

  const detailCellRendererParams = useMemo(
    () => ({
      detailGridOptions: {
        columnDefs: detailColumnDefs(gridMode),
        defaultColDef: gridDefaultColDef,
        headerHeight: DETAIL_ROW_HEIGHT,
        rowHeight: DETAIL_ROW_HEIGHT,
      },
      getDetailRowData: (params: any) =>
        params.successCallback(params.data?.purchase_history ?? []),
    }),
    [gridMode],
  );

  const label = gridMode === "vendor" ? "vendor" : "component";

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="h-[52px] shrink-0 flex items-center justify-between gap-[16px] px-[20px] border-b border-neutral-300">
        <div className="text-[13px] text-slate-600">
          {hasSearched && !loading ? (
            <>
              <b className="text-slate-800">{groups.length}</b> {label}
              {groups.length === 1 ? "" : "s"}
              <span className="mx-[8px] text-slate-300">·</span>
              <b className="text-slate-800">{totalPurchaseOrders}</b> purchase
              order{totalPurchaseOrders === 1 ? "" : "s"}
            </>
          ) : (
            "Purchase History"
          )}
        </div>
        {groups.length > 0 && (
          <TextField
            size="small"
            placeholder="Quick filter…"
            value={quickFilter}
            onChange={(event) => setQuickFilter(event.target.value)}
            sx={{ width: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {!hasSearched && !loading ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-[8px]">
            <InventoryOutlinedIcon sx={{ fontSize: 40 }} />
            <p className="text-[13px]">
              Choose a filter and run a search to see purchase history.
            </p>
          </div>
        ) : (
          <div className="po-history-grid ag-theme-quartz h-full overflow-hidden">
            <AgGridReact<PoHistoryGroup>
              rowData={groups}
              columnDefs={columnDefs}
              defaultColDef={gridDefaultColDef}
              masterDetail
              animateRows
              isRowMaster={(data) => (data?.purchase_history?.length ?? 0) > 0}
              detailCellRendererParams={detailCellRendererParams}
              getRowHeight={(params) =>
                params.node.detail
                  ? detailRowHeight(params.data?.purchase_history?.length ?? 0)
                  : undefined
              }
              getRowId={(params) => groupRowId(params.data)}
              quickFilterText={quickFilter}
              suppressCellFocus
              loading={loading}
              loadingOverlayComponent={CustomLoadingOverlay}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              pagination
              paginationPageSize={20}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PoHistoryGrid;
