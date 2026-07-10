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

interface CreateFolderModalFormProps {
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
  existingNames: string[];
  isSubmitting: boolean;
  submitError: string | null;
  onClearError?: () => void;
}

const CreateFolderModalForm: React.FC<CreateFolderModalFormProps> = ({
  onClose,
  onSubmit,
  existingNames,
  isSubmitting,
  submitError,
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
    const frameId = requestAnimationFrame(() => {
      document.getElementById(inputId)?.focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [inputId]);

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName || isSubmitting || !isNameValid) {
      return;
    }

    await onSubmit(trimmedName);
  };

  return (
    <>
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
    </>
  );
};

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingNames = [],
  isSubmitting = false,
  submitError = null,
  onClearError,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Create folder">
      {isOpen ? (
        <CreateFolderModalForm
          onClose={onClose}
          onSubmit={onSubmit}
          existingNames={existingNames}
          isSubmitting={isSubmitting}
          submitError={submitError ?? null}
          onClearError={onClearError}
        />
      ) : null}
    </Modal>
  );
};
