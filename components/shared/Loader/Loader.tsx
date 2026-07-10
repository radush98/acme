"use client";

import clsx from "clsx";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "../hooks/useIsClient";

interface LoaderProps {
  isOpen: boolean;
  message?: string;
  className?: string;
  children?: ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({
  isOpen,
  message = "Uploading files...",
  className,
  children,
}) => {
  const isClient = useIsClient();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isClient || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-live="polite"
      aria-label={message}
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex min-w-64 flex-col items-center gap-4 rounded-lg border border-border bg-card px-8 py-6 shadow-lg">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary"
          aria-hidden="true"
        />
        {children ?? (
          <p className="text-center text-sm font-medium text-foreground">
            {message}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
};
