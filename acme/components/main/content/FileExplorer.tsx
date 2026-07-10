"use client";

import { DragNDrop } from "@/components/main/content/dragNDrop/DragNDrop";
import { LocationHeader } from "@/components/main/content/locationHeader/LocationHeader";
import { Table } from "@/components/main/content/table/Table";
import { TableRowProps } from "@/components/main/content/table/TableRow";
import { Button } from "@/components/shared/Button/Button";
import { fileStorageService, type FileNode } from "@/shared/services";
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

  const handleCreateFolder = async () => {
    const name = window.prompt("Enter folder name");

    if (!name?.trim()) {
      return;
    }

    await fileStorageService.createFolder(name.trim(), currentFolderId);
    await loadItems();
  };

  return (
    <>
      <LocationHeader
        breadcrumbs={breadcrumbs}
        onNavigate={handleNavigate}
      >
        <Button
          primary
          className="flex items-center gap-2"
          onClick={() => void handleCreateFolder()}
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
          Create Folder
        </Button>
      </LocationHeader>
      {items.length > 0 ? (
        <>
          <DragNDrop parentId={currentFolderId} onUploaded={() => void loadItems()}>
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
        />
      )}
    </>
  );
};
