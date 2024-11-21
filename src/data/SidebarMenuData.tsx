// export const sidebarMenulinklist: SidebarMenuLinkType[] = [
//   { name: "Dashboard", path: "/" },
//   {
//     name: "Material Management",
//     subMenu: [
//       {
//         name: "Master",
//         subMenu: [
//           { name: "UOM", path: "/not-permission" },
//           { name: "Component", path: "/not-permission" },
//           { name: "Products", path: "/not-permission" },
//           { name: "HSN", path: "/not-permission" },
//           { name: "Bom", path: "/not-permission" },

//         ],
//       },
//       {
//         name: "Procurement",
//         subMenu: [
//           { name: " Create PO", path: "/not-permission" },
//           { name: "Manage PO", path: "/not-permission" },
//           { name: "Compleated PO", path: "/not-permission" },
//         ],
//       },
//       {
//         name: "Sales Order",
//         subMenu: [
//           { name: "Create", path: "/sales/order/create" },
//           { name: "Register", path: "/sales/order/register" },
//           { name: "Shipment", path: "/sales/order/shipments" },
//           { name: "Invoice", path: "/sales/order/invoice" },
//           { name: "Allocated Invoices", path: "/sales/order/allocated" },
//           { name: "E Transaction Invoices", path: "/sales/order/e.transaction-register" },
//         ],
//       },
//       {
//         name: "Warehouse",
//         subMenu: [
//           { name: "MR Approval", path: "/not-permission" },
//           { name: "Inward", path: "/not-permission" },
//           { name: "Transfer", path: "/not-permission" },
//           { name: "Pic Slip", path: "/not-permission" },
//           { name: "Batch Allocation", path: "/not-permission" },
//         ],
//       },
//       {
//         name: " FG(s) Inwarding",
//         subMenu: [
//           { name: "Pending FG(s)", path: "/not-permission" },
//           { name: "Complete FG(s)", path: "/not-permission" },
//         ],
//       },
//       {
//         name: "FG(s) OUT",
//         subMenu: [
//           { name: "Create FG(s) OUT", path: "/not-permission" },
//           { name: "View FG(s) OUT", path: "/not-permission" },
//         ],
//       },
//       {
//         name: "Production",
//         subMenu: [{ name: "PPC", path: "/not-permission" }],
//       },
//       {
//         name: "Report (s)",
//         subMenu: [
//           { name: "Inventory report", path: "/not-permission" },
//           { name: "Printing", path: "/not-permission" },
//         ],
//       },
//       {
//         name: "   Query (s)",
//         subMenu: [{ name: "Q1-Q2", path: "/not-permission" }],
//       },
//       {
//         name: " Physical Stock",
//         subMenu: [
//           { name: "Create Physical Stock", path: "/not-permission" },
//           { name: "View Physical Stock", path: "/not-permission" },
//         ],
//       },
//     ],
//   },
//   { name: "Customer Management", subMenu: [{ name: " Customer Enquiry", path: "/not-permission" }] },
// ];
export const materialmenu = [
  {
    name: "Master",

    subMenu: [
      { name: "UOM", path: "/master-uom" },
      { name: "Component", path: "/master-components" },
      { name: "Products", path: "/master-product-fg" },
      { name: "HSN", path: "/not-permission" },
      { name: "Bill of Material", path: "/master-bom-ceate" },
      { name: "Location", path: "/master-location" },
      { name: "Vendor", path: "/master-vender-add" },
      { name: "Billing Address", path: "/master-billing-address" },
      { name: "Shipping Address", path: "/master-shipping-address" },
    ],
  },

  {
    name: "Warehouse",

    subMenu: [
      { name: "MR Approval", path: "/pending-material-approval" },
      { name: "MR Requisition Req", path: "/material-requisition-request" },
      { name: "Raw MIN", path: "/raw-min" },
      { name: "Device MIN", path: "/device-materials-in" },
    ],
  },
];

export const productionMenu = [
  {
    name: "PPC",

    subMenu: [
      {
        name: "Material Requisition",
        subMenu: [
          { name: "Req With BOM", path: "/production/material-req-with-bom" },
          { name: "Req Without BOM", path: "/production/material-req-without-bom" },
        ],
      },
      // {
      //   name: "Production And Plans",
      //   subMenu: [
      //     { name: "Create PPR", path: "/production/create-ppr" },
      //     { name: "Pending PPR", path: "/production/pending-ppr" },
      //     { name: "Complete PPR", path: "/production/complete-ppr" },
      //   ],
      // },
      {
        name: "Production ",
        subMenu: [
          { name: "Create", path: "/production/craete" },
          { name: "Manage", path: "/production/manage" },
        ],
      },
    ],
  },
  {
    name: "Battery QC",
    path: "/production/battery-qc",
  },
  {
    name: "QR Code Generator",
    path: "/production/single-qr-generator",
  },
];

export const TRC = [
  { name: "Add", path: "/production/add-trc" },
  { name: "View", path: "/production/view-trc" },
];
export const Dispatch = [
  { name: "Create", path: "/dispatch/create" },
  { name: "Manage", path: "/dispatch/manage" },
];

export const navSliderData = Array.from({ length: 2 }, (_, i) => ({
  href: `/queries?query=Q${i + 1}`,
  label: `Q${i + 1} Query`,
  value: `Q${i + 1} Query`,
}));
export const reportnav = Array.from({ length: 1 }, (_, i) => ({
  href: `/report?reportno=R${i + 1}`,
  label: `R${i + 1} Report`,
  value: `R${i + 1} Report`,
}));
export const navLinks = [
  { href: "/", label: "Home", value: "home" },
  { href: "/master-uom", label: "UOM", value: "uom" },
  { href: "/master-components", label: "Components", value: "components" },
  { href: "/master-product-fg", label: "Products", value: "products" },
  { href: "/master-bom-ceate", label: "Bom", value: "bom" },
  { href: "/master-location", label: "Location", value: "location" },
  { href: "/master-vender-add", label: "Vendor", value: "vendor" },
  { href: "/master-billing-address", label: "Billing Address", value: "billing-address" },
  { href: "/master-shipping-address", label: "Shipping Address", value: "shipping-address" },
  { href: "/pending-material-approval", label: "MR Approval", value: "mr-approval" },
  { href: "/material-requisition-request", label: "MR Requisition Req", value: "mr-requisition-req" },
  { href: "/raw-min", label: "Raw Min", value: "raw-min" },
  { href: "/production/material-req-with-bom", label: "Req With BOM", value: "req-with-bom" },
  { href: "/production/material-req-without-bom", label: "Req Without BOM", value: "req-without-bom" },
  { href: "/production/create-ppr", label: "Create PPR", value: "create-ppr" },
  { href: "/production/pending-ppr", label: "Pending PPR", value: "pending-ppr" },
  { href: "/production/complete-ppr", label: "Complete PPR", value: "complete-ppr" },
  { href: "/device-materials-in", label: "Device MIN", value: "device-min" },
  ...navSliderData,
  ...reportnav,
];
