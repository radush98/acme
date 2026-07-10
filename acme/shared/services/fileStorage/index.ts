import { FileStorageService } from "./fileStorageService";

export type {
  FileNode,
  FileNodeType,
  FileNodeWithUrl,
  StoredFileNode,
  UpdateFileNodeInput,
} from "./types";

export { FileStorageService } from "./fileStorageService";
export {
  formatFileSizeInMb,
  getFormatFromFile,
  getFormatFromMime,
} from "./utils";

export const fileStorageService = new FileStorageService();
