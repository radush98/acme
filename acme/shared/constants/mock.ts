import { TableRowProps } from "@/components/shared/Table/TableRow";

// TODO: Remove
export const items: TableRowProps[] = [
    {
      id: "1",
      type: "folder",
      name: "Projects",
      createdAt: new Date("2026-01-12"),
      updatedAt: new Date("2026-03-04"),
    },
    {
      id: "2",
      type: "folder",
      name: "Archive",
      createdAt: new Date("2025-11-02"),
      updatedAt: new Date("2026-02-18"),
    },
    {
      id: "3",
      type: "file",
      name: "invoice-march.pdf",
      size: 245760,
      createdAt: new Date("2026-03-01"),
      updatedAt: new Date("2026-03-01"),
    },
    {
      id: "4",
      type: "file",
      name: "contract-draft.pdf",
      size: 512000,
      createdAt: new Date("2026-02-14"),
      updatedAt: new Date("2026-02-28"),
    },
    {
      id: "5",
      type: "file",
      name: "meeting-notes.pdf",
      size: 102400,
      createdAt: new Date("2026-01-20"),
      updatedAt: new Date("2026-01-22"),
    },
  ];