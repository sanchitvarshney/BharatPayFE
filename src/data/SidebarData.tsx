// sidebarMenuData.js
export const menuData = [
    {
      title: "Material Management",
      icon: "grid",
      children: [
        {
          title: "Master",
          children: [
            { title: "UOM", path: "/master-uom" },
            {
              title: "Component",
              children: [
                { title: "Material", path: "/master-components" }
              ]
            },
            { title: "Product", path: "/master-product-fg" },
            {
              title: "BOM",
              children: [
                { title: "Create BOM", path: "/master-bom-create" },
                { title: "FG BOMs", path: "/master-fg-bom" }
              ]
            },
            { title: "Location", path: "/master-location" },
            { title: "Vendor", path: "/master-vendor-add" },
            { title: "Category", path: "/master-category" },
            { title: "Client", path: "/master-client" }
          ]
        },
        {
          title: "Warehouse",
          children: [
            {
              title: "Material Approval",
              children: [
                { title: "Approve", path: "/pending-material-approval" },
                { title: "Approved List", path: "/material-requisition-request" },
                { title: "Swipe Approval", path: "/swipe-approval" }
              ]
            },
            { title: "Raw MIN", path: "/raw-min" },
            { title: "Device MIN", path: "/device-materials-in" },
            { title: "SIM MIN", path: "/sim-min" }
          ]
        },
        { title: "Physical Quantity Update Abnormal", path: "/physical-quantity-update" }
      ]
    },
    {
      title: "Production Management",
      icon: "production",
      children: [
        {
          title: "PPC",
          children: [
            {
              title: "Material Request",
              children: [
                { title: "Req With BOM", path: "/production/material-req-with-bom" },
                { title: "Req without BOM", path: "/production/material-req-without-bom" },
                { title: "Swipe Device Req", path: "/production/swipe-device-request" }
              ]
            },
            {
              title: "Production",
              children: [
                { title: "Create", path: "/production/create" },
                { title: "Manage", path: "/production/manage" }
              ]
            }
          ]
        },
        { title: "Battery QC", path: "/production/battery-qc" }
      ]
    },
    {
      title: "TRC",
      icon: "trc",
      children: [
        { title: "Add", path: "/production/add-trc" },
        { title: "View", path: "/production/view-trc" }
      ]
    },
    {
      title: "Dispatch",
      icon: "dispatch",
      children: [
        { title: "Create", path: "/dispatch/create" },
        { title: "Manage", path: "/dispatch/manage" },
        { title: "QR Generate", path: "/production/single-qr-generator" },
        { title: "Wrong Device", path: "/dispatch/wrong-device" }
      ]
    },
    {
      title: "Generate Eway Bill",
      icon: "ewaybill",
      path: "/eway-bill-details"
    },
    {
      title: "Report",
      icon: "report",
      path: "/report/R1"
    },
    {
      title: "Query",
      icon: "report",
      children: [
        { title: "Q1", path: "/queries/Q1" },
        { title: "Q2", path: "/queries/Q2" },
        { title: "Q3", path: "/queries/Q3" },
        { title: "Q4", path: "/queries/Q4" },
        { title: "Q5", path: "/queries/Q5" },
        { title: "Q6", path: "/queries/Q6" }
      ]
    },
    {
      title: "Upload Swipe Status",
      icon: "Swipe",
      path: "/upload/swipe-device-status"
    }
  ];
  