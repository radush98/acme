"use client";

import { PreviewSidebar } from "@/components/main/filePreview/PreviewSidebar";
import { fileStorageService, type FileNode } from "@/shared/services";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FilePreviewProps {
  fileId: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ fileId }) => {
  const [file, setFile] = useState<FileNode | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      setError(null);
      setPreviewUrl(null);
      setFile(null);

      try {
        const node = await fileStorageService.getById(fileId);

        if (!node || node.type !== "file") {
          setError("File not found.");
          return;
        }

        const url = await fileStorageService.getPreviewUrl(fileId);

        if (!url) {
          setError("Preview is not available for this file.");
          return;
        }

        setFile(node);
        setPreviewUrl(url);
      } catch {
        setError("Failed to load file preview.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPreview();
  }, [fileId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        fileStorageService.revokePreviewUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        Loading preview...
      </div>
    );
  }

  if (error || !file || !previewUrl) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg text-foreground">{error ?? "File not found."}</p>
        <Link href="/" className="text-primary hover:underline">
          Back to Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <iframe
        src={previewUrl}
        title={file.name}
        className="min-h-0 flex-1 border-0 bg-zinc-900"
      />
      <PreviewSidebar file={file} />
    </div>
  );
};
