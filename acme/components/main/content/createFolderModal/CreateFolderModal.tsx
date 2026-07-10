"use client";

import { Button } from "@/components/shared/Button/Button";
import {
  Input,
  type InputValidator,
} from "@/components/shared/Input/Input";
import { Modal, ModalFooter, ModalHeader } from "@/components/shared/Modal";
import { useEffect, useId, useMemo, useState } from "react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
  isSubmitting?: boolean;
}

const INVALID_WINDOWS_CHARS_REGEX = /[<>:"/\\|?*\x00-\x1F]/;
const RESERVED_WINDOWS_NAMES = new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9",
]);

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const inputId = useId();
  const [name, setName] = useState("");

  const folderNameValidators: InputValidator[] = useMemo(
    () => [
      (value) => (value.trim().length ? null : "Folder name is required."),
      (value) =>
        INVALID_WINDOWS_CHARS_REGEX.test(value)
          ? 'Name contains invalid characters: < > : " / \\ | ? *'
          : null,
      (value) =>
        value.endsWith(" ") || value.endsWith(".")
          ? "Name cannot end with a space or period."
          : null,
      (value) =>
        value === "." || value === ".."
          ? "Name cannot be . or .."
          : null,
      (value) =>
        RESERVED_WINDOWS_NAMES.has(value.split(".")[0].toUpperCase())
          ? "This name is reserved by Windows."
          : null,
    ],
    [],
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
    onClose();
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
          error={nameValidationError}
          onChange={(event) => setName(event.target.value)}
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
