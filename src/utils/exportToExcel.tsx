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
  Adaptor: string;
  Cable: string;
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
  inDate: string
}

export const exportToExcel = (data: VendorData[], fileName: string): void => {
  const formattedData: any[] = [];

  // Get all dynamic columns from the first item in the data
  const dynamicColumns = [
    "VendorCode",
    "VendorName",
    "VendorAddress",
    "AWBNo",
    "Serial",
    "IMEI",
    "Quantity",
    "Product",
    "TotalDebit",
    "inDate",
    ...Object.keys(data[0]?.issues)  // Extracting issue fields dynamically
  ];

  data.forEach((item) => {
    const issue = item.issues;

    // Push the values in the right structure
    const row: any = {
      VendorCode: item?.vendorCode,
      VendorName: item?.vendorName,
      VendorAddress: item?.vendorAddress,
      AWBNo: item?.awbNo,
      Serial: item?.serial,
      IMEI: item?.imei,
      Quantity: item?.quantity,
      Product: item?.product,
      TotalDebit: item?.totalDebit,
      inDate: item?.inDate,
      ...issue,  // Spread the issue object into the row
    };

    // Push the row data into the formattedData
    formattedData.push(row);
  });

  // Convert the data to a sheet
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData, { header: dynamicColumns });

  // Set column widths dynamically (adjust based on the column name length or content)
  worksheet["!cols"] = dynamicColumns?.map((col) => ({
    wch: Math.max(col?.length, 15), // Ensure at least 15 characters wide
  }));

  // Create a workbook and append the sheet
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Device MIN V2");

  // Write the file to disk
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};