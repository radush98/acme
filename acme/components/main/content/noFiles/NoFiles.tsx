"use client";

import { partitionFiles, toAcceptAttribute } from "@/components/main/content/dragNDrop/utils";
import { Button } from "@/components/shared/Button/Button";
import { Loader } from "@/components/shared/Loader/Loader";
import { fileStorageService } from "@/shared/services";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

interface NoFilesProps {
  parentId?: string | null;
  onUploaded?: () => void;
}

const ACCEPTED_MIME_TYPES = ["application/pdf"];

export const NoFiles = ({ parentId = null, onUploaded }: NoFilesProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || isUploading) {
      return;
    }

    const { accepted } = partitionFiles(files, ACCEPTED_MIME_TYPES);
    if (!accepted.length) {
      return;
    }

    setIsUploading(true);

    try {
      await Promise.all(
        accepted.map((file) => fileStorageService.upload(file, parentId)),
      );
      onUploaded?.();
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <Loader isOpen={isUploading} />
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-md border border-border p-4">
        <FontAwesomeIcon icon={faFolder} className="text-4xl text-muted-foreground" />
        <h2 className="text-2xl font-bold">This folder is empty</h2>
        <p className="text-muted-foreground">
          Drag and drop files here or click the button below to upload
        </p>
        <Button
          primary
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUpload} className="h-4 w-4 text-white" />
          Upload First Document
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={toAcceptAttribute(ACCEPTED_MIME_TYPES)}
          multiple
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </div>
    </>
  );
};
