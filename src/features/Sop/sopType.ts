type FolderData = {
  folderId: string;
  name: string;
  parentId: string;
  children?: FolderData[]; // Optional, since files might not have children
};

export type FolderDataResponse = {
  message: string;
  success: boolean;
  data: FolderData[]; // Array of top-level folders or files
};

export type FileDataReponse = {
  message: string;
  success: boolean;
  data: Filedata[];
};

export type Filedata = {
  name: string;
  url: string;
  size: number;
  created_at: string;
};

export type SopState = {
  folderData: FolderData[] | null;
  folderDataLoading: boolean;
  createFolderLoading: boolean;
  deleteFolderLoading: boolean;
  uploadFileLoading: boolean;
  getFileLoading: boolean;
  fileData: Filedata[] | null;
};
