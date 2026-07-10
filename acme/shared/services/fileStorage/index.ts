import { FileStorageService } from "./fileStorageService";

export type {
  FileNode,
  FileNodeType,
  FileNodeWithUrl,
  StoredFileNode,
  UpdateFileNodeInput,
} from "./types";

export { FileStorageService } from "./fileStorageService";
export { getFormatFromFile, getFormatFromMime } from "./utils";

export const fileStorageService = new FileStorageService();
