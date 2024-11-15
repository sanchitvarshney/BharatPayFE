// folderData.ts
import { v4 as uuidv4 } from "uuid";

export type FolderDataType = {
  id: string;
  name: string;
  children?: FolderDataType[];
};

export const initialFolderData: FolderDataType[] = [
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

// Recursive function to add a new folder to the targeted folder
export const addFolderToTarget = (folders: FolderDataType[], targetId: string, newFolderName: string): FolderDataType[] => {
  const newFolder = { id: uuidv4(), name: newFolderName };

  const addRecursively = (folders: FolderDataType[]): FolderDataType[] => {
    return folders.map((folder) => {
      if (folder.id === targetId) {
        const updatedChildren = folder.children ? [...folder.children, newFolder] : [newFolder];
        return { ...folder, children: updatedChildren };
      }
      if (folder.children) {
        return { ...folder, children: addRecursively(folder.children) };
      }
      return folder;
    });
  };

  return addRecursively(folders);
};
