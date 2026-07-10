import { formatFileSizeInMb, type FileNode } from "@/shared/services";
import type { ReactNode } from "react";

interface PreviewSidebarProps {
  file: FileNode;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-semibold tracking-wide text-primary">
      {children}
    </h3>
  );
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

export const PreviewSidebar: React.FC<PreviewSidebarProps> = ({ file }) => {
  const uploadedOn = file.createdAt.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-6 overflow-y-auto border-l border-border bg-card p-6">
      <section className="space-y-4">
        <SectionTitle>DOCUMENT METADATA</SectionTitle>
        <div className="space-y-3">
          <MetadataRow label="File Name" value={file.name} />
          <MetadataRow
            label="Size"
            value={formatFileSizeInMb(file.size)}
          />
          <MetadataRow
            label="Format"
            value={file.format ? `${file.format}` : "PDF"}
          />
          <MetadataRow label="Uploaded By" value="User" />
          <MetadataRow label="Uploaded On" value={uploadedOn} />
        </div>
      </section>
    </aside>
  );
};
