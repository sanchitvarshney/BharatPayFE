import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { setShipId } from "@/features/master/client/clientSlice";
import EditClientShippingAddress from "@/components/featureModels/EditClientShippingAddress";

const MasterClientBranchShippingDetailTable: React.FC = () => {
  const { addressDetailLoading, addressDetail } = useAppSelector((state) => state.client);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      resizable: true,
      valueGetter: "node.rowIndex + 1",
      maxWidth: 80,
    },
    {
      headerName: "#",
      field: "shipId",
      hide: true,
    },

    {
      headerName: "Label",
      field: "label",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "GST",
      field: "gst",
      sortable: true,
      filter: true,
    },
    {
      headerName: "PAN No.",
      field: "panno",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Company",
      field: "company",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "State Code",
      field: "state.stateCode",
      sortable: true,
      filter: true,
      hide: true,
    },
    {
      headerName: "State Name",
      field: "state.stateName",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Country ID",
      field: "country.countryID",
      sortable: true,
      filter: true,
      hide: true,
    },
    {
      headerName: "Country Name",
      field: "country.countryName",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Address Line 1",
      field: "addressLine1",
      sortable: true,
      filter: true,
      resizable: true,
      autoHeight: true,
    },
    {
      headerName: "Address Line 2",
      field: "addressLine2",
      sortable: true,
      filter: true,
      resizable: true,
      autoHeight: true,
    },
    {
      headerName: "Pincode",
      field: "pinCode",
      sortable: true,
      filter: true,
    },

    {
      headerName: "Inserted At",
      field: "insertedAt",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "",
      field: "action ",
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center h-full">
            <MuiTooltip title="Edit" placement="top">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  dispatch(setShipId(params.data.shipId));
                  setOpen(true);
                }}
              >
                <Icons.edit fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </div>
        );
      },
      maxWidth: 100,
      pinned: "right",
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: false,
    };
  }, []);
  return (
    <div>
      <EditClientShippingAddress open={open} handleClose={() => setOpen(false)}  />
      <div className=" ag-theme-quartz h-[calc(100vh-50px)]">
        <AgGridReact
          loading={addressDetailLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={addressDetail?.data?.shippingAddress || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </div>
  );
};

export default MasterClientBranchShippingDetailTable;
