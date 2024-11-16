// folderData.ts

export type FolderDataType = {
  folderId: string;
  name: string;
  parentId: string;
  children?: FolderDataType[];
};

export const findFolderNameById = (data: FolderDataType[], folderId: string): string | null => {
  // Recursive helper function to search the folder structure
  const searchFolder = (folders: FolderDataType[]): string | null => {
    for (const folder of folders) {
      if (folder.folderId === folderId) {
        return folder.name;
      }
      if (folder.children) {
        const found = searchFolder(folder.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  return searchFolder(data);
};

// Recursive function to add a new folder to the targeted folder
