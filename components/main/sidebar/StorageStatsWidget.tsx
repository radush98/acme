"use client";

import {
  fileStorageService,
  formatFileSizeInMb,
  type StorageStats,
} from "@/shared/services";
import { faFile, faFolder } from "@fortawesome/free-regular-svg-icons";
import { faHardDrive } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";

export const STORAGE_CHANGED_EVENT = "acme-storage-changed";

function StatRow({
  icon,
  label,
  value,
}: {
  icon: typeof faHardDrive;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

export const StorageStatsWidget: React.FC = () => {
  const [stats, setStats] = useState<StorageStats>({
    totalSize: 0,
    fileCount: 0,
    folderCount: 0,
  });

  const loadStats = useCallback(async () => {
    const nextStats = await fileStorageService.getStorageStats();
    setStats(nextStats);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const nextStats = await fileStorageService.getStorageStats();
      if (!cancelled) {
        setStats(nextStats);
      }
    })();

    const handleStorageChanged = () => {
      void loadStats();
    };

    window.addEventListener(STORAGE_CHANGED_EVENT, handleStorageChanged);

    return () => {
      cancelled = true;
      window.removeEventListener(STORAGE_CHANGED_EVENT, handleStorageChanged);
    };
  }, [loadStats]);

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Storage overview</h2>
      <div className="space-y-3">
        <StatRow
          icon={faHardDrive}
          label="Total size"
          value={formatFileSizeInMb(stats.totalSize)}
        />
        <StatRow
          icon={faFolder}
          label="Folders"
          value={String(stats.folderCount)}
        />
        <StatRow
          icon={faFile}
          label="Files"
          value={String(stats.fileCount)}
        />
      </div>
    </div>
  );
};
