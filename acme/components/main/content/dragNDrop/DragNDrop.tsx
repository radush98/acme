"use client";

import clsx from "clsx";
import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { partitionFiles, toAcceptAttribute } from "./utils";

interface DragNDropProps {
  children?: ReactNode;
  acceptedMimeTypes: string[];
  accept?: string;
  onFiles?: (files: File[]) => void;
  onReject?: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
}

export const DragNDrop: React.FC<DragNDropProps> = ({
  children,
  acceptedMimeTypes,
  accept,
  onFiles,
  onReject,
  multiple,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const { accepted, rejected } = partitionFiles(files, acceptedMimeTypes);

    if (rejected.length) {
      onReject?.(rejected);
    }

    if (accepted.length) {
      onFiles?.(accepted);
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
    <div
      role="button"
      tabIndex={0}
      className={clsx(
        "torn-zone relative min-h-40 cursor-pointer transition-shadow",
        isDragging && "ring-2 ring-primary ring-offset-2",
        className,
      )}
      onClick={() => inputRef.current?.click()}
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
      <div className="relative z-10 flex min-h-40 items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
};
