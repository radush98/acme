"use client";

import { ROOT_LOCATION } from "@/shared/constants";
import type { FileNode } from "@/shared/services";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LocationHeaderProps {
  breadcrumbs?: FileNode[];
  onNavigate?: (folderId: string | null) => void;
  children: React.ReactNode;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({
  breadcrumbs = [],
  onNavigate,
  children,
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <button
          type="button"
          onClick={() => onNavigate?.(null)}
          className="flex items-center gap-2 transition-colors hover:text-primary"
        >
          <FontAwesomeIcon icon={faHome} className="h-4 w-4" />
          {ROOT_LOCATION}
        </button>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <span key={crumb.id} className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              {isLast ? (
                <span>{crumb.name}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate?.(crumb.id)}
                  className="transition-colors hover:text-primary"
                >
                  {crumb.name}
                </button>
              )}
            </span>
          );
        })}
      </h2>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};
