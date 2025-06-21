import React, { Dispatch, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getProcessSwipeReqeustAsync, setRequestDetail } from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, ListItemIcon, Menu } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CachedIcon from "@mui/icons-material/Cached";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from '@mui/icons-material/Print';

type Props = {
  approve: boolean;
  setApprove: Dispatch<React.SetStateAction<boolean>>;
  setAlert: Dispatch<React.SetStateAction<boolean>>;
  setRequestType: Dispatch<React.SetStateAction<string>>;
  setxnId: Dispatch<React.SetStateAction<string>>;
};

const PendingSwipeApprovalTable: React.FC<Props> = ({ setApprove, setAlert, setRequestType, setxnId }) => {
  const dispatch = useAppDispatch();
  const { swipeDeviceLoading, swipeDeviceData } = useAppSelector((state) => state.pendingMr);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [params, setParams] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      maxWidth: 150,
      field: "action",
      cellRenderer: (params: any) => (
        <>
          <div className="flex items-center h-full">
            <IconButton
              onClick={(e) => {
                handleClick(e);
                setParams(params);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </div>
        </>
      ),
    },
    { headerName: "#", field: "id", sortable: true, filter: true, maxWidth: 100, valueGetter: (params: any) => params.node.rowIndex + 1 },
    {headerName: "Product SKU", field: "productSku", sortable: true, filter: true, flex: 1 },
    {headerName: "Product Name", field: "productName", sortable: true, filter: true, flex: 1 },
    {headerName: "Qty", field: "qty", sortable: true, filter: true, flex: 1 },
    { headerName: "Put Location", field: "putLocation", sortable: true, filter: true, flex: 1 },
    { headerName: "Pick Location", field: "pickLocation", sortable: true, filter: true, flex: 1 },
    { headerName: "Request ID", field: "transactionId", sortable: true, filter: true, flex: 1 },
    { headerName: "Request Date", field: "insertDate", sortable: true, filter: true, flex: 1 },
    { headerName: "Request By", field: "requestBy", sortable: true, filter: true, flex: 1 },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 2,

            sx: {
              width: "200px",
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
        anchorOrigin={{ horizontal: "center", vertical: "center" }}
      >
        <MenuItem
          onClick={() => {
            setRequestType(params?.data?.transactionType || "DEVICE");
            dispatch(
              setRequestDetail({
                name: params?.data?.userName,
                id: params?.data?.transactionId,
                requestDate: params?.data?.insertDate,
              })
            );
            setApprove(true);
            dispatch(getProcessSwipeReqeustAsync(params?.data?.transactionId));
          }}
        >
          <ListItemIcon>
            <CachedIcon fontSize="small" />
          </ListItemIcon>
          Process
        </MenuItem>

        <MenuItem disabled onClick={() => {}}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem disabled onClick={() => {}}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          Print
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAlert(true);
            setxnId(params?.data?.transactionId);
          }}
        >
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          Cancel
        </MenuItem>
      </Menu>

      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={swipeDeviceLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={swipeDeviceData || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          enableCellTextSelection = {true}
        />
      </div>
    </div>
  );
};

export default PendingSwipeApprovalTable;
