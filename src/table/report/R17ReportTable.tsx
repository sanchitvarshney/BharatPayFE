import React, { useMemo, useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomPagination from "@/components/reusable/CustomPagination";

interface Question {
  questionId: string;
  question: string;
  answer: string;
}

interface R17ReportTableProps {
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
}

const R17ReportTable: React.FC<R17ReportTableProps> = ({
  onPageChange,
  onPageSizeChange,
  pageSize,
}) => {
  const { r17Report, getR17DataLoading } = useAppSelector(
    (state) => state.report
  );
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "#",
        field: "id",
        valueGetter: "node.rowIndex+1",
        maxWidth: 100,
      },
      {
        field: "productName",
        headerName: "Product Name",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "productCode",
        headerName: "Product Code",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "serial",
        headerName: "Serial Number",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "imei_no1",
        headerName: "IMEI 1",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "imei_no2",
        headerName: "IMEI 2",
        flex: 1,
        minWidth: 120,
      },

      {
        field: "date",
        headerName: "Date",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "remark",
        headerName: "Remark",
        flex: 1,
        minWidth: 180,
      },
      ...Array.from({ length: 21 }, (_, i) => {
        const questionNumber = i + 1;
        const question = r17Report?.data?.[0]?.questions?.find(
          (q: Question) => String(q.questionId) === String(questionNumber)
        );
        return {
          field: `question_${questionNumber}`,
          headerName: question?.question || `Question ${questionNumber}`,
          flex: 1,
          minWidth: 200,
          valueGetter: (params: any) => {
            const question = params.data.questions.find(
              (q: Question) => String(q.questionId) === String(questionNumber)
            );
            return question?.answer || "--";
          },
        };
      }),
    ],
    [r17Report?.data]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="relative ag-theme-quartz h-[calc(100vh-150px)]">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={getR17DataLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={r17Report?.data || []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableCellTextSelection={true}
            tooltipShowDelay={0}
            tooltipHideDelay={2000}
          />
        </div>
      </div>
      {r17Report && (
        <CustomPagination
          currentPage={r17Report.page}
          totalPages={r17Report.totalPages}
          totalRecords={r17Report.totalRecords}
          onPageChange={onPageChange}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default R17ReportTable;
