"use client";

import { Button } from "@/components/shared/Button/Button";
import { Modal, ModalFooter, ModalHeader } from "@/components/shared/Modal";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FileNodeType } from "@/shared/services";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  itemType: FileNodeType;
  itemName: string;
  descendantCount?: number;
  isDeleting?: boolean;
}

function getNestedItemsLabel(count: number): string {
  if (count === 1) {
    return "1 nested file and subfolder";
  }

  return `${count} nested files and subfolders`;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName,
  descendantCount = 0,
  isDeleting = false,
}) => {
  const itemLabel = itemType === "folder" ? "folder" : "file";
  const showFolderWarning = itemType === "folder" && descendantCount > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={`Delete ${itemLabel}`}>
      <ModalHeader title="Delete" onClose={onClose} />
      <div className="space-y-4 px-6 py-4">
        <p className="text-base text-foreground">
          Are you absolutely sure you want to delete the {itemLabel}{" "}
          <span className="font-semibold">&quot;{itemName}&quot;</span>?
        </p>

        {showFolderWarning ? (
          <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-destructive">
              <FontAwesomeIcon icon={faCircleExclamation} className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-destructive">
                Warning: This action is irreversible
              </p>
              <p className="text-sm text-destructive/90">
                This folder contains {getNestedItemsLabel(descendantCount)}.
                Deleting it will permanently erase all contents from the virtual
                data room.
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <ModalFooter>
        <Button
          type="button"
          className="border border-border"
          disabled={isDeleting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          disabled={isDeleting}
          onClick={() => void onConfirm()}
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};
