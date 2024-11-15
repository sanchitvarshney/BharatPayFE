type FolderData =  {
  folderId: string;
  name: string;
  parentId: string;
  children?: FolderData[]; // Optional, since files might not have children
}

export type FolderDataResponse =  {
  message: string;
  success: boolean;
  data: FolderData[]; // Array of top-level folders or files
}


export type SopState = {
  folderData: FolderData[] | null;
  folderDataLoading: boolean;
createFolderLoading: boolean
};
