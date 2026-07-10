import { MIME_EXTENSIONS } from "@/shared/constants";
import type { FileNode, StoredFileNode } from "./types";

const BYTES_IN_MB = 1024 * 1024;

export function formatFileSizeInMb(sizeInBytes?: number): string {
  if (sizeInBytes === undefined) {
    return "-";
  }

  const sizeInMb = sizeInBytes / BYTES_IN_MB;
  return `${sizeInMb.toFixed(2)} MB`;
}

const MIME_FORMAT_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
};

export function getFormatFromMime(mimeType: string): string {
  if (MIME_FORMAT_LABELS[mimeType]) {
    return MIME_FORMAT_LABELS[mimeType];
  }

  const extension = MIME_EXTENSIONS[mimeType]?.[0];
  if (extension) {
    return extension.slice(1).toUpperCase();
  }

  const subtype = mimeType.split("/")[1];
  return subtype ? subtype.toUpperCase() : "UNKNOWN";
}

export function getFormatFromFile(file: File): string {
  if (file.type) {
    return getFormatFromMime(file.type);
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) {
    return "UNKNOWN";
  }

  for (const [mimeType, extensions] of Object.entries(MIME_EXTENSIONS)) {
    if (extensions.includes(`.${extension}`)) {
      return getFormatFromMime(mimeType);
    }
  }

  return extension.toUpperCase();
}

export function toStoredNode(node: FileNode): StoredFileNode {
  return {
    ...node,
    createdAt: node.createdAt.getTime(),
    updatedAt: node.updatedAt.getTime(),
  };
}

export function fromStoredNode(node: StoredFileNode): FileNode {
  return {
    ...node,
    createdAt: new Date(node.createdAt),
    updatedAt: new Date(node.updatedAt),
  };
}
