import * as XLSX from "xlsx";

interface Issue {
  issueName: string;
  issuePrice: string;
}

interface VendorData {
  vendorCode: string;
  vendorName: string;
  vendorAddress: string;
  awbNo: string;
  serial: string;
  imei: string;
  quantity: string;
  product: string;
  totalDebit: string;
  issues: Issue[];
}

export const exportToExcel = (data: VendorData[], fileName: string): void => {
  const formattedData: any[] = [];

  data.forEach((item) => {
    if (item.issues.length > 0) {
      item.issues.forEach((issue, index) => {
        formattedData.push({
          VendorCode: index === 0 ? item.vendorCode : "",
          VendorName: index === 0 ? item.vendorName : "",
          VendorAddress: index === 0 ? item.vendorAddress : "",
          AWBNo: index === 0 ? item.awbNo : "",
          Serial: index === 0 ? item.serial : "",
          IMEI: index === 0 ? item.imei : "",
          Quantity: index === 0 ? item.quantity : "",
          Product: index === 0 ? item.product : "",
          TotalDebit: index === 0 ? item.totalDebit : "",
          IssueName: issue.issueName,
          IssuePrice: issue.issuePrice,
        });
      });
    } else {
      formattedData.push({
        VendorCode: item.vendorCode,
        VendorName: item.vendorName,
        VendorAddress: item.vendorAddress,
        AWBNo: item.awbNo,
        Serial: item.serial,
        IMEI: item.imei,
        Quantity: item.quantity,
        Product: item.product,
        TotalDebit: item.totalDebit,
        IssueName: "",
        IssuePrice: "",
      });
    }
  });

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
  worksheet["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 10 }];

  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Device MIN V2");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
