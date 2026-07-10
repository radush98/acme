"use client";

import {
  faCheckCircle,
  faCircleXmark,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

export type ToastVariant = "success" | "warning" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface UploadToastProps {
  title: string;
  subtitle?: string;
  fileName?: string;
  size?: string;
  variant: ToastVariant;
  actions?: ToastAction[];
  onClose: () => void;
}

export const UploadToast: React.FC<UploadToastProps> = ({
  title,
  subtitle,
  fileName,
  size,
  variant,
  actions = [],
  onClose,
}) => {
  const variantStyles: Record<
    ToastVariant,
    { borderColor: string; badgeClassName: string; icon: typeof faCheckCircle }
  > = {
    success: {
      borderColor: "#10b981",
      badgeClassName: "bg-emerald-100 text-emerald-600",
      icon: faCheckCircle,
    },
    warning: {
      borderColor: "#f59e0b",
      badgeClassName: "bg-amber-100 text-amber-600",
      icon: faTriangleExclamation,
    },
    error: {
      borderColor: "#ef4444",
      badgeClassName: "bg-red-100 text-red-600",
      icon: faCircleXmark,
    },
  };

  const { borderColor, badgeClassName, icon } = variantStyles[variant];

  return (
    <div
      className="pointer-events-auto flex w-[560px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-2xl border border-border bg-muted p-4 shadow-lg"
      style={{
        borderLeftWidth: 5,
        borderLeftColor: borderColor,
      }}
    >
      <div className={clsx("mt-0.5 flex h-9 w-9 items-center justify-center rounded-full", badgeClassName)}>
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-foreground">{title}</p>
        {subtitle ? (
          <p className="text-base text-muted-foreground">{subtitle}</p>
        ) : null}
        {fileName ? (
          <p className="truncate text-base font-semibold text-foreground">
            "{fileName}" {size ? `(${size}).` : ""}
          </p>
        ) : null}
        {actions.length ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={clsx(
                  "rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
                  variant === "warning" ? "text-amber-700" : "text-foreground",
                )}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        className="text-muted-foreground transition-colors hover:text-foreground"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
      </button>
    </div>
  );
};
