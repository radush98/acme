"use client";

import { CreateFolderModal } from "@/components/main/content/createFolderModal/CreateFolderModal";
import { DragNDrop } from "@/components/main/content/dragNDrop/DragNDrop";
import { LocationHeader } from "@/components/main/content/locationHeader/LocationHeader";
import { Table } from "@/components/main/content/table/Table";
import { TableRowProps } from "@/components/main/content/table/TableRow";
import { Button } from "@/components/shared/Button/Button";
import {
  UploadToaster,
  useUploadToasts,
} from "@/components/shared/Toast/useUploadToasts";
import {
  fileStorageService,
  type FileNode,
  type UploadNameConflictStrategy,
} from "@/shared/services";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { NoFiles } from "./noFiles/NoFiles";

function toTableRow(node: FileNode): TableRowProps {
  return {
    id: node.id,
    type: node.type,
    name: node.name,
    size: node.size,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
  };
}

export const FileExplorer = () => {
  const [items, setItems] = useState<TableRowProps[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<FileNode[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const { showUploadSuccessToast, showUploadErrorToast, showWarningToast } =
    useUploadToasts();

  const loadItems = useCallback(async () => {
    const children = await fileStorageService.getChildren(currentFolderId);
    setItems(children.map(toTableRow));
  }, [currentFolderId]);

  const loadBreadcrumbs = useCallback(async () => {
    const path = await fileStorageService.getBreadcrumbs(currentFolderId);
    setBreadcrumbs(path);
  }, [currentFolderId]);

  useEffect(() => {
    void loadItems();
    void loadBreadcrumbs();
  }, [loadItems, loadBreadcrumbs]);

  const handleNavigate = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };

  const handleFolderOpen = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleCreateFolder = async (name: string) => {
    setIsCreatingFolder(true);

    try {
      await fileStorageService.createFolder(name, currentFolderId);
      await loadItems();
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFileNameConflict = useCallback(
    (file: File): Promise<UploadNameConflictStrategy | "skip"> =>
      new Promise((resolve) => {
        showWarningToast({
          title: "File already exists",
          subtitle: "Choose what to do with this file",
          fileName: file.name,
          duration: Infinity,
          onClose: () => resolve("skip"),
          actions: [
            {
              label: "Overwrite",
              onClick: () => resolve("overwrite"),
            },
            {
              label: "Rename",
              onClick: () => resolve("rename"),
            },
          ],
        });
      }),
    [showWarningToast],
  );

  return (
    <>
      <LocationHeader
        breadcrumbs={breadcrumbs}
        onNavigate={handleNavigate}
      >
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => setIsCreateFolderModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
          Create Folder
        </Button>
      </LocationHeader>
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        isSubmitting={isCreatingFolder}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onSubmit={handleCreateFolder}
      />
      <UploadToaster />
      {items.length > 0 ? (
        <>
          <DragNDrop
            parentId={currentFolderId}
            onUploaded={() => void loadItems()}
            onFileUploadSuccess={showUploadSuccessToast}
            onFileUploadError={showUploadErrorToast}
            onFileNameConflict={handleFileNameConflict}
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Drag and Drop</h1>
              <p className="text-sm text-gray-500">Drag and drop files here</p>
            </div>
          </DragNDrop>
          <Table
            items={items.map((item) =>
              item.type === "folder"
                ? { ...item, onClick: () => handleFolderOpen(item.id) }
                : item,
            )}
          />
        </>
      ) : (
        <NoFiles
          parentId={currentFolderId}
          onUploaded={() => void loadItems()}
          onFileUploadSuccess={showUploadSuccessToast}
          onFileUploadError={showUploadErrorToast}
          onFileNameConflict={handleFileNameConflict}
        />
      )}
    </>
  );
};
