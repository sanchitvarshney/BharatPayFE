import * as XLSX from "xlsx";

interface Issue {
  "Device ID": string;
  Charger: string;
  SIM: string;
  "Sound Check - OK": string;
  Bracket: string;
  "No Physical Damage": string;
  "No Internal Damage": string;
  Box: string;
  Standee: string;
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
  issues: Issue; // Changed to a single object
}

export const exportToExcel = (data: VendorData[], fileName: string): void => {
  const formattedData: any[] = [];

  data.forEach((item) => {
    const issue = item.issues;

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
      DeviceID: issue["Device ID"] || "",
      Charger: issue.Charger || "",
      SIM: issue.SIM || "",
      "Sound Check - OK": issue["Sound Check - OK"] || "",
      Bracket: issue.Bracket || "",
      "No Physical Damage": issue["No Physical Damage"] || "",
      "No Internal Damage": issue["No Internal Damage"] || "",
      Box: issue.Box || "",
      Standee: issue.Standee || "",
    });
  });

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 10 },
  ];

  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Device MIN V2");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
