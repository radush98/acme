import { MIME_EXTENSIONS } from "@/shared/constants/mimeExtensions";

export function toAcceptAttribute(acceptedMimeTypes: string[]): string {
  return acceptedMimeTypes
    .flatMap((mimeType) => [mimeType, ...(MIME_EXTENSIONS[mimeType] ?? [])])
    .join(",");
}
