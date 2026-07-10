"use client";

import clsx from "clsx";
import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { partitionFiles, toAcceptAttribute } from "./utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { fileStorageService, type FileNode } from "@/shared/services";
import { Loader } from "@/components/shared/Loader/Loader";

interface DragNDropProps {
  children?: ReactNode;
  acceptedMimeTypes?: string[];
  accept?: string;
  onFiles?: (files: File[]) => void;
  onReject?: (files: File[]) => void;
  onUploaded?: (nodes: FileNode[]) => void;
  onUploadError?: (error: unknown) => void;
  onFileUploadSuccess?: (file: File, node: FileNode) => void;
  onFileUploadError?: (file: File, error: unknown) => void;
  parentId?: string | null;
  multiple?: boolean;
  className?: string;
}

export const DragNDrop: React.FC<DragNDropProps> = ({
  children,
  acceptedMimeTypes = ["application/pdf"],
  accept,
  onFiles,
  onReject,
  onUploaded,
  onUploadError,
  onFileUploadSuccess,
  onFileUploadError,
  parentId = null,
  multiple = true,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);

    try {
      const uploadResults = await Promise.allSettled(
        files.map((file) => fileStorageService.upload(file, parentId)),
      );

      const uploadedNodes: FileNode[] = [];
      const uploadedFiles: File[] = [];
      const errors: unknown[] = [];

      uploadResults.forEach((result, index) => {
        const file = files[index];

        if (result.status === "fulfilled") {
          uploadedNodes.push(result.value);
          uploadedFiles.push(file);
          onFileUploadSuccess?.(file, result.value);
          return;
        }

        errors.push(result.reason);
        onFileUploadError?.(file, result.reason);
      });

      if (uploadedNodes.length) {
        onUploaded?.(uploadedNodes);
        onFiles?.(uploadedFiles);
      }

      if (errors.length) {
        onUploadError?.(errors[0]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length || isUploading) {
      return;
    }

    const { accepted, rejected } = partitionFiles(files, acceptedMimeTypes);

    if (rejected.length) {
      onReject?.(rejected);
    }

    if (accepted.length) {
      void uploadFiles(accepted);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <>
      <Loader isOpen={isUploading} />
      <div
      role="button"
      tabIndex={0}
      aria-busy={isUploading}
      className={clsx(
        "relative min-h-40 cursor-pointer transition-shadow border-2 border-dashed border-gray-300 rounded-md",
        isDragging && "ring-2 ring-primary ring-offset-2",
        isUploading && "pointer-events-none opacity-60",
        className,
      )}
      onClick={() => !isUploading && inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept ?? toAcceptAttribute(acceptedMimeTypes)}
        multiple={multiple}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="relative z-10 flex min-h-40 items-center justify-center p-6 flex-col gap-2 text-center">
        <div className="flex items-center justify-center bg-accent rounded-full p-2">
            <FontAwesomeIcon icon={faUpload} className="w-10 h-10 text-primary" />
        </div>
        {children}
      </div>
    </div>
    </>
  );
};
