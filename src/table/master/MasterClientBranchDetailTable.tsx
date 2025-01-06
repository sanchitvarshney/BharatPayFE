import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import ShippingAddressDetail from "@/components/Drawers/client/ShippingAddressDetail";
import { getClientAddressDetail, setAddressId, setBillId } from "@/features/master/client/clientSlice";
import AddClientShippingAddress from "@/components/featureModels/AddClientShippingAddress";
import EditClientBillingAddress from "@/components/featureModels/EditClientBillingAddress";

const MasterClientBranchDetailTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { clientDetail, clientDetailLoading, addressId } = useAppSelector((state) => state.client);
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [addShipAddress, setAddShipAddress] = React.useState(false);
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "#",
      sortable: true,
      filter: true,
      valueGetter: "node.rowIndex + 1",
      maxWidth: 80,
    },
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      hide: true,
    },
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Phone",
      field: "phone",
      sortable: true,
      filter: true,
    },
    {
      headerName: "GST",
      field: "gst",
      sortable: true,
      filter: true,
    },

    {
      headerName: "Pincode",
      field: "pincode",
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
      headerName: "Address 1",
      field: "address1",
      sortable: true,
      filter: true,
      resizable: true,
      autoHeight: true,
    },
    {
      headerName: "Address 2",
      field: "address2",
      sortable: true,
      filter: true,
      resizable: true,
      autoHeight: true,
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-[5px] h-full w-full justify-center">
          <MuiTooltip title="Edit Bill to Address" placement="top">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                dispatch(setBillId(params.data.id || ""));
                setEdit(true);
              }}
            >
              <Icons.edit fontSize="small" />
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="View/Edit Shipping Address" placement="top">
            <IconButton
              size="small"
              color="warning"
              onClick={() => {
                setOpen(true);
                dispatch(getClientAddressDetail(params.data.id || ""));
                dispatch(setAddressId(params.data.id || ""));
              }}
            >
              <Icons.view fontSize="small" />
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Delete" placement="top">
            <IconButton disabled size="small" color="error">
              <Icons.delete fontSize="small" />
            </IconButton>
          </MuiTooltip>
        </div>
      ),
      pinned: "right",
      maxWidth: 150,
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
      <EditClientBillingAddress open={edit} handleClose={() => setEdit(false)} />
      <AddClientShippingAddress open={addShipAddress} handleClose={() => setAddShipAddress(false)} addressId={addressId || ""} />
      <ShippingAddressDetail addressId={addressId || ""} addAddress={setAddShipAddress} open={open} handleClose={() => setOpen(false)} />
      <div className=" ag-theme-quartz h-[calc(100vh-220px)]">
        <AgGridReact
          loading={clientDetailLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={clientDetail?.branch || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </div>
  );
};

export default MasterClientBranchDetailTable;
