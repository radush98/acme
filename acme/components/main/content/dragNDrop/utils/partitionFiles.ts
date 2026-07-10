import { isAcceptedFile } from "./isAcceptedFile";

export function partitionFiles(
  files: FileList | File[],
  acceptedMimeTypes: string[],
) {
  const accepted: File[] = [];
  const rejected: File[] = [];

  for (const file of Array.from(files)) {
    if (isAcceptedFile(file, acceptedMimeTypes)) {
      accepted.push(file);
    } else {
      rejected.push(file);
    }
  }

  return { accepted, rejected };
}
