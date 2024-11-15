// SopPage.tsx
import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import { Button, Dialog, FormControl, IconButton, InputAdornment, LinearProgress, OutlinedInput, styled } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilesTable from "@/table/sop/FilesTable";
import BreadcrumbComponent from "@/components/shared/sop/BreadcrumbComponent";
import { FolderDataType } from "@/components/shared/sop/folderData";
import { DialogContent, DialogActions, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createFolder, getFolderData } from "@/features/Sop/sopSlice";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { showToast } from "@/utils/toasterContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
export default function SopPage() {
  const [targetDestination, setTargetDestination] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [target, setTarget] = React.useState<string>("");
  const [folderName, setFolderName] = React.useState<string>("");
  const [folders, setFolders] = React.useState<FolderDataType[]>([]);
  const [openFolders, setOpenFolders] = React.useState<{ [key: string]: boolean }>({});
  const dispatch = useAppDispatch();
  const { folderData, folderDataLoading, createFolderLoading } = useAppSelector((state) => state.sop);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (id: string) => {
    setTargetDestination(id);
    setOpenFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddFolder = () => {
    if (!folderName) {
      showToast("Please Enter Folder Name", "error");
    } else {
      dispatch(createFolder({ id: target, name: folderName })).then((res: any) => {
        if (res.payload.data.success) {
          setFolders(res.payload.data.data);
          setOpen(false);
          setFolderName("");
        }
      });
    }
  };

  const renderFolder = (folder: FolderDataType, level = 1) => {
    const isOpen = openFolders[folder.parentId] || false;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder.parentId}>
        <ListItemButton
          onClick={() => handleClick(folder.parentId)}
          sx={{
            pl: 2 * level,
            py: "3px",
          }}
        >
          <ListItemIcon>{isOpen ? <FaFolderOpen className="h-[18px] w-[18px]" /> : <FaFolder className="h-[18px] w-[18px]" />}</ListItemIcon>
          <ListItemText primary={folder.name} />
          <div className="flex items-center gap-[5px]">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
                setTarget(folder.parentId);
              }}
              size="small"
            >
              <AddSharpIcon fontSize="small" />
            </IconButton>
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </div>
        </ListItemButton>
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {folder.children?.map((child) => renderFolder(child, level + 1))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };
  React.useEffect(() => {
    dispatch(getFolderData());
  }, []);
  React.useEffect(() => {
    if (folderData) {
      setFolders(folderData);
    }
  }, [folderData]);
  return (
    <>
      <BootstrapDialog maxWidth="md" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <div className="absolute top-0 left-0 right-0">{createFolderLoading && <LinearProgress />}</div>
        <div className="flex flex-col px-[20px] h-[70px] justify-center gap-[5px]">
          <Typography variant="h3" fontSize={20} fontWeight={500} id="customized-dialog-title">
            Create Folder
          </Typography>
          <BreadcrumbComponent targetId={target} folderData={folders} />
        </div>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <FormControl sx={{ width: "600px", py: "10px" }} variant="outlined">
            <OutlinedInput
              placeholder="Folder Name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FolderIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <Typography gutterBottom>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</Typography>
        </DialogContent>
        <DialogActions>
          <Button disabled={createFolderLoading} startIcon={<CloseIcon fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={createFolderLoading} variant="contained" onClick={handleAddFolder} startIcon={<AddSharpIcon fontSize="small" />}>
            Create
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <div className="h-[calc(100vh-50px)] grid grid-cols-[350px_1fr] bg-white overflow-x-hidden relative">
        <div className="h-full border-r border-neutral-300">{folderDataLoading ? <CustomLoadingOverlay /> : <List component="nav">{folders.map((folder) => renderFolder(folder))}</List>}</div>

        <div className={`${folderDataLoading || !folderData ? "cursor-not-allowed opacity-30 pointer-events-none" : ""}`}>
          <div className="h-[100px] flex flex-col border-b border-neutral-300">
            <div className="h-[30px] border-b border-neutral-300 flex items-center px-[10px]">
              <BreadcrumbComponent targetId={targetDestination} folderData={folders} />
            </div>
            <div className="flex items-center h-[70px] justify-between px-[20px]">
              <FormControl size="small" sx={{ width: "300px" }} fullWidth variant="outlined">
                <OutlinedInput
                  placeholder="Search by name"
                  id="standard-adornment-qty"
                  endAdornment={
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  }
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />
              </FormControl>
              <div className="flex items-center gap-[10px]">
                <Button
                  onClick={() => {
                    setOpen(true);
                    setTarget(targetDestination);
                  }}
                  variant="contained"
                  startIcon={<FolderIcon />}
                >
                  New Folder
                </Button>
                <Button variant="contained" startIcon={<FileUploadIcon />}>
                  Files
                </Button>
                <IconButton>
                  <RefreshIcon />
                </IconButton>
              </div>
            </div>
          </div>
          <FilesTable />
        </div>
      </div>
    </>
  );
}
