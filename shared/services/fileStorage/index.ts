import { FileStorageService } from "./fileStorageService";

export type {
  FileNode,
  FileNodeType,
  FileNodeWithUrl,
  StoredFileNode,
  StorageStats,
  UploadFileOptions,
  UploadNameConflictStrategy,
  UpdateFileNodeInput,
} from "./types";

export { FileStorageService, FileUploadNameConflictError } from "./fileStorageService";
export {
  formatFileSizeInMb,
  getFormatFromFile,
  getFormatFromMime,
} from "./utils";

export const fileStorageService = new FileStorageService();
