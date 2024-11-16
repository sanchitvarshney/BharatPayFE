import React from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, LinearProgress } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import GetAppIcon from "@mui/icons-material/GetApp";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { Filedata } from "@/features/Sop/sopType";
import { downloadFile } from "@/utils/downloadFile";
import { deleteFolder } from "@/features/Sop/sopSlice";
import WarningIcon from '@mui/icons-material/Warning';
type Props = {
  rowdata: Filedata[];
  refreshfile: () => void
};
const FilesTable: React.FC<Props> = ({ rowdata,refreshfile }) => {
  const [id, setId] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch()
  const { getFileLoading,deleteFolderLoading } = useAppSelector((state) => state.sop);
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "ID",
      valueGetter: "node.rowIndex + 1",
      width: 100,
    },
    {
      headerName: "#",
      field: "id",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      hide: true,
    },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
    },
    {
      headerName: "Type",
      field: "type",
      flex: 1,
    },
    {
      headerName: "Size",
      field: "size",
      flex: 1,
    },
    {
      headerName: "Upload Date",
      field: "created_at",

      flex: 1,
    },
    {
      headerName: "",
      field: "url",

      flex: 1,
      hide: true,
    },
    {
      headerName: "Actions",
      field: "type",
      flex: 1,
      cellRenderer: (params: any) => {
        return (
          <div className="h-full flex items-center gap-[3px]">
            <MuiTooltip title="View" placement="bottom">
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  window.open(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${params.data.url}`, "_blank");
                }}
              >
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </MuiTooltip>
            <MuiTooltip title="Download" placement="bottom">
              <IconButton disabled color="success" onClick={() => downloadFile({fileName: params.data.name, fileUrl: `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${params.data.url}`})}>
                <GetAppIcon fontSize="small" />
              </IconButton>
            </MuiTooltip>
            <MuiTooltip title="Delete" placement="bottom">
              <IconButton color="error" size="small"
              
              onClick={() => {
               setId(params.data.id);
               setOpen(true);
              }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Wrapper>
       <Dialog maxWidth="md" open={open} onClose={() => setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <div className="absolute top-0 left-0 right-0">{deleteFolderLoading && <LinearProgress />}</div>
        <DialogTitle id="alert-dialog-title">{"Are you absolutely sure?"}</DialogTitle>
        <DialogContent sx={{ width: "600px" }}>
          <DialogContentText id="alert-dialog-description" color="warning" fontSize={13}>
            <WarningIcon color="warning" sx={{ mr: 1 }} fontSize="small" />
            Do you Want to delete  this file? This action will permanently delete the selected file. This operation cannot be undone. Do you still want to proceed?
          </DialogContentText>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() =>setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              dispatch(deleteFolder(id)).then((res: any) => {
                if (res.payload.data.success) {
                setOpen(false);
                refreshfile()
                }
              });
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <div className="ag-theme-quartz h-[calc(100vh-150px)]">
        <AgGridReact
          rowData={rowdata}
          loading={getFileLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={50}
          loadingCellRenderer="customLoadingCellRenderer"
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ag-theme-quartz .ag-header {
    font-family: cursive;
    background-color: #fff;
  }
`;
export default FilesTable;
