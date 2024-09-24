import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { StatusBarModule } from "@ag-grid-enterprise/status-bar";
import { ServerSideRowModelModule } from "@ag-grid-enterprise/server-side-row-model";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import { MenuModule } from '@ag-grid-enterprise/menu';
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { CsvExportModule } from "@ag-grid-community/csv-export";

export function moduleregistri(){
  return  ModuleRegistry.registerModules([CsvExportModule,RowGroupingModule,ColumnsToolPanelModule,SetFilterModule,FiltersToolPanelModule,ClientSideRowModelModule,MenuModule, RangeSelectionModule, StatusBarModule, ServerSideRowModelModule, ExcelExportModule]);
} 


  export const  gridOptions = {    
    sideBar: {
        toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                    toolPanelParams: {
                        suppressValues: true,
                        suppressPivots: true,
                        suppressPivotMode: true,
                        suppressRowGroups: false
                    }
                },
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                }
            ],
            defaultToolPanel: ''
        }
    };