// BreadcrumbComponent.tsx
import * as React from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

type FolderDataType = {
  folderId: string;
  name: string;
  parentId: string;
  children?: FolderDataType[];
};

// Utility function to find the path for breadcrumb
const findPath = (folders: FolderDataType[], targetId: string, path: FolderDataType[] = []): FolderDataType[] | null => {
  for (const folder of folders) {
    if (folder.parentId === targetId) {
      return [...path, folder];
    }
    if (folder.children) {
      const result = findPath(folder.children, targetId, [...path, folder]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

interface BreadcrumbComponentProps {
  targetId: string;
  folderData: FolderDataType[];
}

const BreadcrumbComponent: React.FC<BreadcrumbComponentProps> = ({ targetId, folderData }) => {
  const path = findPath(folderData, targetId);

  return (
    <div>
      {path && (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          {path.map((folder) => (
            <Typography key={folder.parentId} color="text.primary" fontSize="12px">
              {folder.name}
            </Typography>
          ))}
        </Breadcrumbs>
      )}
    </div>
  );
};

export default BreadcrumbComponent;
