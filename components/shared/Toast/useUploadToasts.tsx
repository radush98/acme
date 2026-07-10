"use client";

import { formatFileSizeInMb } from "@/shared/services";
import { useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import { UploadToast, type ToastAction, type ToastVariant } from "./UploadToast";

interface ShowToastParams {
  variant: ToastVariant;
  title: string;
  subtitle?: string;
  fileName?: string;
  size?: string;
  actions?: ToastAction[];
  duration?: number;
  onClose?: () => void;
}

export function useUploadToasts() {
  const showToast = useCallback(
    ({
      variant,
      title,
      subtitle,
      fileName,
      size,
      actions = [],
      duration = 4500,
      onClose,
    }: ShowToastParams) => {
      toast.custom(
        (toastItem) => (
          <UploadToast
            variant={variant}
            title={title}
            subtitle={subtitle}
            fileName={fileName}
            size={size}
            actions={actions.map((action) => ({
              ...action,
              onClick: () => {
                action.onClick();
                toast.dismiss(toastItem.id);
              },
            }))}
            onClose={() => {
              onClose?.();
              toast.dismiss(toastItem.id);
            }}
          />
        ),
        { duration },
      );
    },
    [],
  );

  const showUploadSuccessToast = useCallback((file: File) => {
    const fileSize = formatFileSizeInMb(file.size);
    showToast({
      variant: "success",
      title: "Upload Successful",
      subtitle: "Successfully uploaded",
      fileName: file.name,
      size: fileSize,
    });
  }, [showToast]);

  const showUploadErrorToast = useCallback((file: File) => {
    showToast({
      variant: "error",
      title: "Upload Failed",
      subtitle: "Could not upload file",
      fileName: file.name,
    });
  }, [showToast]);

  const showWarningToast = useCallback(
    ({
      title,
      subtitle,
      fileName,
      size,
      actions,
      duration,
      onClose,
    }: Omit<ShowToastParams, "variant">) => {
      showToast({
        variant: "warning",
        title,
        subtitle,
        fileName,
        size,
        actions,
        duration,
        onClose,
      });
    },
    [showToast],
  );

  return {
    showToast,
    showUploadSuccessToast,
    showUploadErrorToast,
    showWarningToast,
  };
}

export const UploadToaster: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{ duration: 4500 }}
    />
  );
};
