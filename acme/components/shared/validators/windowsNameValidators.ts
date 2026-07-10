import type { InputValidator } from "@/components/shared/Input/Input";

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

export function createWindowsNameValidators(
  requiredMessage: string,
): InputValidator[] {
  return [
    (value) => (value.trim().length ? null : requiredMessage),
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
  ];
}

export function createDuplicateNameValidator(
  existingNames: string[],
  options?: { excludeName?: string; itemType?: "folder" | "file" },
): InputValidator {
  const normalizedExistingNames = new Set(
    existingNames
      .filter(
        (name) =>
          !options?.excludeName ||
          name.toLocaleLowerCase() !== options.excludeName.toLocaleLowerCase(),
      )
      .map((name) => name.toLocaleLowerCase()),
  );

  const itemLabel = options?.itemType ?? "item";

  return (value) =>
    normalizedExistingNames.has(value.trim().toLocaleLowerCase())
      ? `A ${itemLabel} with this name already exists in this folder.`
      : null;
}
