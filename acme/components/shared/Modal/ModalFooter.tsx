import clsx from "clsx";
import type { ReactNode } from "react";

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-end gap-2 border-t border-border px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
};
