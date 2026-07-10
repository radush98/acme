export type FileNodeType = "folder" | "file";

export type FileNode = {
  id: string;
  name: string;
  type: FileNodeType;
  parentId: string | null;
  size?: number;
  format?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FileNodeWithUrl = FileNode & {
  url?: string;
};

export type UpdateFileNodeInput = {
  name?: string;
  parentId?: string | null;
};

export type UploadNameConflictStrategy = "error" | "overwrite" | "rename";

export type UploadFileOptions = {
  nameConflict?: UploadNameConflictStrategy;
};

export type StorageStats = {
  totalSize: number;
  fileCount: number;
  folderCount: number;
};

export type StoredFileNode = Omit<FileNode, "createdAt" | "updatedAt"> & {
  createdAt: number;
  updatedAt: number;
};
