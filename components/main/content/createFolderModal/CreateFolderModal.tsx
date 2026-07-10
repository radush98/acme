"use client";

import { Button } from "@/components/shared/Button/Button";
import { Input } from "@/components/shared/Input/Input";
import { Modal, ModalFooter, ModalHeader } from "@/components/shared/Modal";
import { createDuplicateNameValidator, createWindowsNameValidators } from "@/components/shared/validators/windowsNameValidators";
import { useEffect, useId, useMemo, useState } from "react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
  existingNames?: string[];
  isSubmitting?: boolean;
  submitError?: string | null;
  onClearError?: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingNames = [],
  isSubmitting = false,
  submitError = null,
  onClearError,
}) => {
  const inputId = useId();
  const [name, setName] = useState("");

  const folderNameValidators = useMemo(
    () => [
      ...createWindowsNameValidators("Folder name is required."),
      createDuplicateNameValidator(existingNames, { itemType: "folder" }),
    ],
    [existingNames],
  );

  const nameValidationError = useMemo(() => {
    for (const validator of folderNameValidators) {
      const message = validator(name);
      if (message) {
        return message;
      }
    }

    return null;
  }, [folderNameValidators, name]);

  const isNameValid = !nameValidationError;

  useEffect(() => {
    if (!isOpen) {
      setName("");
      return;
    }

    const frameId = requestAnimationFrame(() => {
      document.getElementById(inputId)?.focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, inputId]);

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName || isSubmitting || !isNameValid) {
      return;
    }

    await onSubmit(trimmedName);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Create folder">
      <ModalHeader title="Create Folder" onClose={onClose} />
      <div className="px-6 py-4">
        <Input
          label="Folder name"
          id={inputId}
          type="text"
          value={name}
          disabled={isSubmitting}
          placeholder="Enter folder name"
          validators={folderNameValidators}
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
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
};
