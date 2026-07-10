"use client";

import { CreateFolderModal } from "@/components/main/content/createFolderModal/CreateFolderModal";
import { DeleteModal } from "@/components/main/content/deleteModal/DeleteModal";
import { RenameModal } from "@/components/main/content/renameModal/RenameModal";
import { DragNDrop } from "@/components/main/content/dragNDrop/DragNDrop";
import { LocationHeader } from "@/components/main/content/locationHeader/LocationHeader";
import { Table } from "@/components/main/content/table/Table";
import { TableRowProps } from "@/components/main/content/table/TableRow";
import { Button } from "@/components/shared/Button/Button";
import { STORAGE_CHANGED_EVENT } from "@/components/main/sidebar/StorageStatsWidget";
import {
  UploadToaster,
  useUploadToasts,
} from "@/components/shared/Toast/useUploadToasts";
import {
  fileStorageService,
  type FileNode,
  type FileNodeType,
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
  const [createFolderError, setCreateFolderError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: FileNodeType;
    name: string;
  } | null>(null);
  const [descendantCount, setDescendantCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    type: FileNodeType;
    name: string;
  } | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);
  const { showUploadSuccessToast, showUploadErrorToast, showWarningToast } =
    useUploadToasts();

  const siblingNames = items.map((item) => item.name);

  const loadItems = useCallback(async () => {
    const children = await fileStorageService.getChildren(currentFolderId);
    setItems(children.map(toTableRow));
    window.dispatchEvent(new Event(STORAGE_CHANGED_EVENT));
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

  const handleRenameRequest = (item: TableRowProps) => {
    setRenameError(null);
    setRenameTarget({
      id: item.id,
      type: item.type,
      name: item.name,
    });
  };

  const handleConfirmRename = async (name: string) => {
    if (!renameTarget) {
      return;
    }

    setIsRenaming(true);
    setRenameError(null);

    try {
      await fileStorageService.update(renameTarget.id, { name });
      setRenameTarget(null);
      await loadItems();
      await loadBreadcrumbs();
    } catch (error) {
      setRenameError(
        error instanceof Error ? error.message : "Failed to rename item.",
      );
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDeleteRequest = async (item: TableRowProps) => {
    setDeleteTarget({
      id: item.id,
      type: item.type,
      name: item.name,
    });

    if (item.type === "folder") {
      const count = await fileStorageService.getDescendantCount(item.id);
      setDescendantCount(count);
      return;
    }

    setDescendantCount(0);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await fileStorageService.delete(deleteTarget.id);
      setDeleteTarget(null);
      await loadItems();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateFolder = async (name: string) => {
    setIsCreatingFolder(true);
    setCreateFolderError(null);

    try {
      await fileStorageService.createFolder(name, currentFolderId);
      setIsCreateFolderModalOpen(false);
      await loadItems();
    } catch (error) {
      setCreateFolderError(
        error instanceof Error ? error.message : "Failed to create folder.",
      );
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
          onClick={() => {
            setCreateFolderError(null);
            setIsCreateFolderModalOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
          Create Folder
        </Button>
      </LocationHeader>
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        isSubmitting={isCreatingFolder}
        existingNames={siblingNames}
        submitError={createFolderError}
        onClose={() => {
          setIsCreateFolderModalOpen(false);
          setCreateFolderError(null);
        }}
        onClearError={() => setCreateFolderError(null)}
        onSubmit={handleCreateFolder}
      />
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        itemType={deleteTarget?.type ?? "file"}
        itemName={deleteTarget?.name ?? ""}
        descendantCount={descendantCount}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
      <RenameModal
        isOpen={Boolean(renameTarget)}
        itemType={renameTarget?.type ?? "file"}
        initialName={renameTarget?.name ?? ""}
        existingNames={siblingNames}
        isSubmitting={isRenaming}
        submitError={renameError}
        onClose={() => {
          setRenameTarget(null);
          setRenameError(null);
        }}
        onClearError={() => setRenameError(null)}
        onSubmit={handleConfirmRename}
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
            items={items.map((item) => ({
              ...item,
              onClick:
                item.type === "folder"
                  ? () => handleFolderOpen(item.id)
                  : undefined,
              onRename: () => handleRenameRequest(item),
              onDelete: () => void handleDeleteRequest(item),
            }))}
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
