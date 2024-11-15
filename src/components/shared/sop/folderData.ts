// folderData.ts


export type FolderDataType = {
  folderId: string;
  name: string;
  parentId: string;
  children?: FolderDataType[];
};


// Recursive function to add a new folder to the targeted folder
