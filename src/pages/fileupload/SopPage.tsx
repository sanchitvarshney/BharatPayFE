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
import { Button, Dialog, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, OutlinedInput, styled, TextField } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilesTable from "@/table/sop/FilesTable";
import BreadcrumbComponent from "@/components/shared/sop/BreadcrumbComponent";
import { findFolderNameById, FolderDataType } from "@/components/shared/sop/folderData";
import { DialogContent, DialogActions, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createFolder, deleteFolder, getFileAsync, getFolderData, uploadFileAsync } from "@/features/Sop/sopSlice";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { showToast } from "@/utils/toasterContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import FileUploader from "@/components/reusable/FileUploader";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { Filedata } from "@/features/Sop/sopType";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
export default function SopPage() {
  const [deleteInput, setDeleteInput] = React.useState<string>("");
  const [targetDestination, setTargetDestination] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [target, setTarget] = React.useState<string>("");
  const [folderName, setFolderName] = React.useState<string>("");
  const [folders, setFolders] = React.useState<FolderDataType[]>([]);
  const [openFolders, setOpenFolders] = React.useState<{ [key: string]: boolean }>({});
  const [deleteAlrert, setDeleteAlert] = React.useState<boolean>(false);
  const [uploadFile, setUploadFile] = React.useState<boolean>(false);
  const [fileList, setFileList] = React.useState<File[] | null>([]);
  const [filename, setFilename] = React.useState<string>("");
  const [rowdata, setRowData] = React.useState<Filedata[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const dispatch = useAppDispatch();
  const { folderData, folderDataLoading, createFolderLoading, deleteFolderLoading, uploadFileLoading, fileData } = useAppSelector((state) => state.sop);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuclick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.currentTarget.focus();
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (id: string) => {
    setRowData([]);
    dispatch(getFileAsync(id));
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
  const refreshFile = () => {
    dispatch(getFileAsync(targetDestination));
  };
  const handleUpload = () => {
    if (!filename) {
      showToast("Please Enter File Name", "error");
    } else if (!fileList) {
      showToast("Please Select File", "error");
    } else {
      const formdata = new FormData();
      formdata.append("file", fileList![0]);
      formdata.append("fileName", filename);
      formdata.append("folderId", targetDestination);
      dispatch(uploadFileAsync(formdata)).then((res: any) => {
        if (res.payload.data.success) {
          setUploadFile(false);
          setFileList(null);
          setFilename("");
          refreshFile();
        }
      });
    }
  };
  const renderFolder = (folder: FolderDataType, level = 1) => {
    const isOpen = openFolders[folder.folderId] || false;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder.folderId}>
        <ListItemButton
          onClick={() => handleClick(folder.folderId)}
          sx={{
            pl: 2 * level,
            py: "3px",
            background: folder.folderId === targetDestination ? "#e0f2f1" : "",
            "&:hover": {
              background: "#e0f2f1",
            },
          }}
        >
          <ListItemIcon>{isOpen ? <FaFolderOpen className="h-[18px] w-[18px]" /> : <FaFolder className="h-[18px] w-[18px]" />}</ListItemIcon>
          <ListItemText primary={folder.name} />
          <div className="flex items-center gap-[5px]">
            {folder.parentId === "parent" ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuClose();
                  setOpen(true);
                  setTarget(folder.folderId);
                }}
              >
                <AddSharpIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuclick(e);
                  setTarget(folder.folderId);
                }}
                size="small"
                aria-controls={openMenu ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}

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
  const collectAllFolderIds = (folders: FolderDataType[]): { [key: string]: boolean } => {
    let allFolders: { [key: string]: boolean } = {};
    folders.forEach((folder) => {
      allFolders[folder.folderId] = true; // Expand by default
      if (folder.children) {
        allFolders = { ...allFolders, ...collectAllFolderIds(folder.children) };
      }
    });
    return allFolders;
  };
  React.useEffect(() => {
    dispatch(getFolderData()).then((res: any) => {
      if (res.payload.data.success) {
        setOpenFolders(collectAllFolderIds(res.payload.data.data));
      }
    });
  }, []);
  React.useEffect(() => {
    if (folderData) {
      setFolders(folderData);
    }
  }, [folderData]);

  React.useEffect(() => {
    if (fileData) {
      if (search) {
        setRowData(fileData.filter((row: Filedata) => row.name.toLowerCase().includes(search.toLowerCase())));
      } else {
        setRowData(fileData);
      }
    }
  }, [search, fileData]);

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
            setOpen(true);
          }}
        >
          <ListItemIcon>
            <AddSharpIcon fontSize="small" />
          </ListItemIcon>
          Create New Folder
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            setDeleteAlert(true);
            setDeleteInput("");
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete Folder
        </MenuItem>
      </Menu>
      <Dialog maxWidth="md" open={deleteAlrert} onClose={() => setDeleteAlert(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <div className="absolute top-0 left-0 right-0">{deleteFolderLoading && <LinearProgress />}</div>
        <DialogTitle id="alert-dialog-title">{"Are you absolutely sure?"}</DialogTitle>
        <DialogContent sx={{ width: "600px" }}>
          <DialogContentText id="alert-dialog-description" color="warning" fontSize={13}>
            <WarningIcon color="warning" sx={{ mr: 1 }} fontSize="small" />
            Do you Want to delete <b>{findFolderNameById(folders, target)}</b> folder? This action will permanently delete the selected folder and all of its contents, including any subfolders and files. This operation cannot be undone. Do you still want to proceed?
          </DialogContentText>
          <Typography sx={{ my: 2 }}>
            To confirm, type <b>"delete/{findFolderNameById(folders, target)}"</b> in the box below
          </Typography>
          <TextField size="small" fullWidth onChange={(e) => setDeleteInput(e.target.value)} value={deleteInput} />
        </DialogContent>
        <DialogActions>
          <Button disabled={deleteFolderLoading} onClick={() => setDeleteAlert(false)}>
            Cancel
          </Button>
          <Button
            disabled={deleteInput !== `delete/${findFolderNameById(folders, target)}` || deleteFolderLoading}
            variant="contained"
            color="error"
            onClick={() => {
              dispatch(deleteFolder(target)).then((res: any) => {
                if (res.payload.data.success) {
                  setFolders(res.payload.data.data);
                  setDeleteAlert(false);
                  if (target === targetDestination) {
                    refreshFile();
                  }
                }
              });
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
          <Typography gutterBottom>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</Typography>
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
      <BootstrapDialog maxWidth="md" onClose={setUploadFile} aria-labelledby="customized-dialog-title" open={uploadFile}>
        <div className="absolute top-0 left-0 right-0">{uploadFileLoading && <LinearProgress />}</div>
        <div className="flex flex-col px-[20px] h-[70px] justify-center gap-[5px]">
          <Typography variant="h3" fontSize={20} fontWeight={500} id="customized-dialog-title">
            Upload File
          </Typography>
          <BreadcrumbComponent targetId={targetDestination} folderData={folders} />
        </div>
        <IconButton
          aria-label="close"
          onClick={() => setUploadFile(false)}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers sx={{ width: "700px" }}>
          <TextField sx={{ my: "10px" }} fullWidth label="File Name" variant="outlined" size="small" value={filename} onChange={(e) => setFilename(e.target.value)} />
          <FileUploader value={fileList} onFileChange={setFileList} />
        </DialogContent>
        <DialogActions>
          <Button disabled={uploadFileLoading} startIcon={<CloseIcon fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }} onClick={() => setUploadFile(false)}>
            Cancel
          </Button>
          <Button disabled={uploadFileLoading} variant="contained" onClick={handleUpload} startIcon={<FileUploadIcon fontSize="small" />}>
            Upload
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <div className="h-[calc(100vh-50px)] grid grid-cols-[350px_1fr] bg-white overflow-x-hidden relative">
        <div className="h-full overflow-y-auto border-r border-neutral-300">{folderDataLoading ? <CustomLoadingOverlay /> : <List component="nav">{folders.map((folder) => renderFolder(folder))}</List>}</div>

        <div className={`${folderDataLoading || !folderData ? "cursor-not-allowed opacity-30 pointer-events-none" : ""}`}>
          <div className="h-[100px] flex flex-col border-b border-neutral-300">
            <div className="h-[30px] border-b border-neutral-300 flex items-center px-[10px]">
              <BreadcrumbComponent targetId={targetDestination} folderData={folders} />
            </div>
            <div className="flex items-center h-[70px] justify-between px-[20px]">
              <FormControl size="small" sx={{ width: "300px" }} fullWidth variant="outlined">
                <OutlinedInput
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
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
                  disabled={!targetDestination}
                  onClick={() => {
                    setUploadFile(true);
                    setFileList(null);
                    setFilename("");
                  }}
                  variant="contained"
                  startIcon={<FileUploadIcon />}
                >
                  Files
                </Button>
                <MuiTooltip title="Refresh" placement="bottom">
                  <IconButton
                    onClick={() => {
                      if (targetDestination) {
                        refreshFile();
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </MuiTooltip>
              </div>
            </div>
          </div>
          <FilesTable rowdata={rowdata} refreshfile={refreshFile} />
        </div>
      </div>
    </>
  );
}
