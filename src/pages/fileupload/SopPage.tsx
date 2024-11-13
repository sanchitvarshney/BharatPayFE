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
import { Button, FormControl, IconButton, InputAdornment,  OutlinedInput } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilesTable from "@/table/sop/FilesTable";

type FolderDataType = {
  id: string;
  name: string;
  children?: FolderDataType[];
};

const folderData: FolderDataType[] = [
  {
    id: "1",
    name: "Folder 1",
    children: [
      {
        id: "1-1",
        name: "Subfolder 1",
        children: [{ id: "1-1-1", name: "Sub-Subfolder 1" }],
      },
    ],
  },
  {
    id: "2",
    name: "Folder 2",
  },
];
export default function SopPage() {

  const [openFolders, setOpenFolders] = React.useState<{ [key: string]: boolean }>({});

  const handleClick = (id: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const renderFolder = (folder: FolderDataType, level = 1) => {
    const isOpen = openFolders[folder.id] || false;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder.id} >
        <ListItemButton onClick={() => handleClick(folder.id)} sx={{ pl: 2 * level  }}>
          <ListItemIcon>{isOpen ? <FaFolderOpen className="h-[18px] w-[18px]" /> : <FaFolder className="h-[18px] w-[18px]" />}</ListItemIcon>
          <ListItemText primary={folder.name} />
          <div className="flex items-center gap-[5px]">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
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

  return (
    <>
      <div className="h-[calc(100vh-50px)] grid grid-cols-[350px_1fr] bg-white">
        <div className="border-r border-neutral-300">
          <List component="nav" aria-labelledby="nested-list-subheader">
            {folderData.map((folder) => renderFolder(folder))}
          </List>
        </div>
        <div>
          <div className="h-[60px] flex items-center justify-between px-[20px] border-b border-neutral-300">
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
              <Button variant="contained" startIcon={<FolderIcon />}>
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
          <div className="h-[calc(100vh-110px)]">
            <FilesTable />
          </div>
        </div>
      </div>
    </>
  );
}
