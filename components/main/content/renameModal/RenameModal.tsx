"use client";

import { Button } from "@/components/shared/Button/Button";
import { Input } from "@/components/shared/Input/Input";
import { Modal, ModalFooter, ModalHeader } from "@/components/shared/Modal";
import { createDuplicateNameValidator, createWindowsNameValidators } from "@/components/shared/validators/windowsNameValidators";
import type { FileNodeType } from "@/shared/services";
import { useEffect, useId, useMemo, useState } from "react";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
  itemType: FileNodeType;
  initialName: string;
  existingNames?: string[];
  isSubmitting?: boolean;
  submitError?: string | null;
  onClearError?: () => void;
}

interface RenameModalFormProps {
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
  itemType: FileNodeType;
  initialName: string;
  existingNames: string[];
  isSubmitting: boolean;
  submitError: string | null;
  onClearError?: () => void;
}

const RenameModalForm: React.FC<RenameModalFormProps> = ({
  onClose,
  onSubmit,
  itemType,
  initialName,
  existingNames,
  isSubmitting,
  submitError,
  onClearError,
}) => {
  const inputId = useId();
  const [name, setName] = useState(initialName);

  const nameValidators = useMemo(
    () => [
      ...createWindowsNameValidators(
        itemType === "folder" ? "Folder name is required." : "File name is required.",
      ),
      createDuplicateNameValidator(existingNames, {
        excludeName: initialName,
        itemType,
      }),
    ],
    [existingNames, initialName, itemType],
  );

  const nameValidationError = useMemo(() => {
    for (const validator of nameValidators) {
      const message = validator(name);
      if (message) {
        return message;
      }
    }

    return null;
  }, [name, nameValidators]);

  const trimmedName = name.trim();
  const isNameUnchanged =
    trimmedName.toLocaleLowerCase() === initialName.toLocaleLowerCase();
  const isNameValid = !nameValidationError && !isNameUnchanged;

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const input = document.getElementById(inputId) as HTMLInputElement | null;
      input?.focus();
      input?.select();
    });

    return () => cancelAnimationFrame(frameId);
  }, [inputId]);

  const handleSubmit = async () => {
    if (!trimmedName || isSubmitting || !isNameValid) {
      return;
    }

    await onSubmit(trimmedName);
  };

  const itemLabel = itemType === "folder" ? "folder" : "file";

  return (
    <>
      <ModalHeader title={`Rename ${itemLabel}`} onClose={onClose} />
      <div className="px-6 py-4">
        <Input
          label={`${itemType === "folder" ? "Folder" : "File"} name`}
          id={inputId}
          type="text"
          value={name}
          disabled={isSubmitting}
          placeholder={`Enter ${itemLabel} name`}
          validators={nameValidators}
          error={nameValidationError ?? submitError}
          onChange={(event) => {
            onClearError?.();
            setName(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSubmit();
            }
          }}
        />
      </div>
      <ModalFooter>
        <Button
          type="button"
          className="border border-border"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={!isNameValid || isSubmitting}
          onClick={() => void handleSubmit()}
        >
          Rename
        </Button>
      </ModalFooter>
    </>
  );
};

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  itemType,
  initialName,
  existingNames = [],
  isSubmitting = false,
  submitError = null,
  onClearError,
}) => {
  const itemLabel = itemType === "folder" ? "folder" : "file";

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={`Rename ${itemLabel}`}>
      {isOpen ? (
        <RenameModalForm
          onClose={onClose}
          onSubmit={onSubmit}
          itemType={itemType}
          initialName={initialName}
          existingNames={existingNames}
          isSubmitting={isSubmitting}
          submitError={submitError ?? null}
          onClearError={onClearError}
        />
      ) : null}
    </Modal>
  );
};
