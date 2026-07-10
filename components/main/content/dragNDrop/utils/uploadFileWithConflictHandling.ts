import {
  fileStorageService,
  FileUploadNameConflictError,
  type FileNode,
  type UploadNameConflictStrategy,
} from "@/shared/services";

type UploadFileResult =
  | { status: "success"; file: File; node: FileNode }
  | { status: "skipped"; file: File }
  | { status: "error"; file: File; error: unknown };

export async function uploadFileWithConflictHandling(
  file: File,
  parentId: string | null,
  onFileNameConflict?: (
    file: File,
  ) => Promise<UploadNameConflictStrategy | "skip">,
): Promise<UploadFileResult> {
  try {
    const node = await fileStorageService.upload(file, parentId);
    return { status: "success", file, node };
  } catch (error) {
    if (!(error instanceof FileUploadNameConflictError) || !onFileNameConflict) {
      return { status: "error", file, error };
    }

    const strategy = await onFileNameConflict(file);
    if (strategy === "skip") {
      return { status: "skipped", file };
    }

    try {
      const node = await fileStorageService.upload(file, parentId, {
        nameConflict: strategy,
      });
      return { status: "success", file, node };
    } catch (resolvedError) {
      return { status: "error", file, error: resolvedError };
    }
  }
}
