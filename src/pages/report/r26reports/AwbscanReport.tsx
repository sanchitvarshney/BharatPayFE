import React, { useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { getawbscanReport } from "@/features/report/report/reportSummarySlice";
import AwbscanTable from "@/table/report/r26tabls/AwbscanTable";
import WrongAwbscanTable from "@/table/report/r26tabls/WrongAwbScanTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportShell from "@/components/report/r26/ReportShell";
import { TableSearch } from "@/components/report/r26/ReportBlocks";
import { useR26Report } from "@/components/report/r26/useR26Report";
import { formatNumber } from "@/components/report/r26/reportUtils";

type DetailTab = "products" | "wrong";

const AwbscanReport: React.FC = () => {
  const { awbscanreportLoading, awbscanreport } = useAppSelector((state) => state.reportSummary);
  const productGridRef = useRef<AgGridReact<any>>(null);
  const wrongGridRef = useRef<AgGridReact<any>>(null);
  const { date, setRange, generate, meta, error, fileSuffix } = useR26Report(
    "awbscan",
    getawbscanReport,
  );
  const [tab, setTab] = useState<DetailTab>("products");
  const [search, setSearch] = useState<Record<DetailTab, string>>({ products: "", wrong: "" });

  const hasRows = !!awbscanreport?.data?.length;

  const handleExport = () => {
    const productApi = productGridRef.current?.api;
    const wrongApi = wrongGridRef.current?.api;
    if (!hasRows || !productApi) {
      showToast("No data to export", "error");
      return;
    }
    const sheets = [productApi.getSheetDataForExcel({ sheetName: "AWB Scan Summary" })];
    if (awbscanreport?.WrongDevice?.breakdown?.length && wrongApi) {
      sheets.push(wrongApi.getSheetDataForExcel({ sheetName: "Wrong Scan Breakdown" }));
    }
    productApi.exportMultipleSheetsAsExcel({
      data: sheets.filter((s): s is string => !!s),
      fileName: `AWB_Scan_Report_${fileSuffix}.xlsx`,
    });
  };

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as DetailTab)} className="lg:h-full">
      <ReportShell
        title="AWB Scan Report"
        description="Scan count per product and wrong-scan breakdown."
        reportName="AWB scan report"
        date={date}
        onDateChange={setRange}
        onGenerate={generate}
        loading={awbscanreportLoading}
        meta={meta}
        error={error}
        hasReport={!!awbscanreport}
        onExport={handleExport}
        canExport={hasRows}
        summary={[
          {
            label: "Total Wrong Scan",
            value: formatNumber(awbscanreport?.WrongDevice?.totalWrongDevices),
            highlight: true,
          },
        ]}
        toolbar={
          <>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="wrong">Wrong Scan Breakdown</TabsTrigger>
            </TabsList>
            <TableSearch
              value={search[tab]}
              onChange={(v) => setSearch((s) => ({ ...s, [tab]: v }))}
              placeholder={tab === "products" ? "Search products…" : "Search categories…"}
            />
          </>
        }
      >
        {/* Both grids stay mounted so export can include both sheets. */}
        <TabsContent value="products" forceMount className="mt-0 h-full data-[state=inactive]:hidden">
          <AwbscanTable gridRef={productGridRef} quickFilterText={search.products} />
        </TabsContent>
        <TabsContent value="wrong" forceMount className="mt-0 h-full data-[state=inactive]:hidden">
          <WrongAwbscanTable gridRef={wrongGridRef} quickFilterText={search.wrong} />
        </TabsContent>
      </ReportShell>
    </Tabs>
  );
};

export default AwbscanReport;
