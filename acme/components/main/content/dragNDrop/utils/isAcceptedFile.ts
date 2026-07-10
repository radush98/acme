import { MIME_EXTENSIONS } from "@/shared/constants";

export function isAcceptedFile(
  file: File,
  acceptedMimeTypes: string[],
): boolean {
  if (acceptedMimeTypes.includes(file.type)) {
    return true;
  }

  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  return acceptedMimeTypes.some((mimeType) =>
    MIME_EXTENSIONS[mimeType]?.includes(extension),
  );
}
