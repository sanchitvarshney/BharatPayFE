import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
type Props = {
  updateProduct?: boolean;
  setUpdateProduct?: React.Dispatch<React.SetStateAction<boolean>>;
  viewProduct?: boolean;
  setViewProduct?: React.Dispatch<React.SetStateAction<boolean>>;
};

const MasterProductFgTable: React.FC<Props> = ({ setUpdateProduct, setViewProduct }) => {
  const { products, getProductsLoading } = useAppSelector((state) => state.product);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuclick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.currentTarget.focus();
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "action",
      cellRenderer: () => (
        <>
          <IconButton onClick={handleMenuclick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </>
      ),
      sortable: false,
      filter: false,
      width: 80,
    },
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: false,
      maxWidth: 80,
      valueGetter: (params: any) => params.node.rowIndex + 1,
    },
    {
      headerName: "Product Name",
      field: "p_name",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "SKU",
      field: "p_sku",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Unit",
      field: "units_name",
      sortable: true,
      filter: true,
      flex: 1,
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);
  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              overflow: "visible",
              mt: 1.5,
              ml: -2.5,
              border: "1px solid #d3d3d3",
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                left: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
                borderTop: "1px solid #d3d3d3",
                borderLeft: "1px solid #d3d3d3",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setUpdateProduct && setUpdateProduct(true);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            setViewProduct && setViewProduct(true);
          }}
        >
          <ListItemIcon>
            <FullscreenIcon fontSize="small" />
          </ListItemIcon>
          View
        </MenuItem>
        <MenuItem
          disabled
          onClick={() => {
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <FileUploadIcon fontSize="small" />
          </ListItemIcon>
          Upload
        </MenuItem>
      </Menu>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loading={getProductsLoading}
          suppressCellFocus={true}
          paginationPageSize={20}
          rowData={products}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSizeSelector={[20, 30, 50]}
        />
      </div>
    </>
  );
};

export default MasterProductFgTable;
